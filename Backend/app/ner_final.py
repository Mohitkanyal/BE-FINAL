import json
from datasets import Dataset
import evaluate
from transformers import BertTokenizerFast, BertForTokenClassification, Trainer, TrainingArguments, pipeline
import torch
from collections import defaultdict

# ---------------------------
# Load metric
# ---------------------------
metric = evaluate.load("seqeval")

# ---------------------------
# Load dataset (JSON format: DATE/TODAY/YESTERDAY/BLOCKERS/REPORT)
# ---------------------------
with open('daily_report_ner_dataset.json', 'r') as f:
    data = json.load(f)

dataset = Dataset.from_list(data)
dataset = dataset.train_test_split(test_size=0.1)
train_dataset = dataset['train']
val_dataset = dataset['test']

print(f"Training examples: {len(train_dataset)}")
print(f"Validation examples: {len(val_dataset)}")

# ---------------------------
# Define labels
# ---------------------------
unique_labels = [
    "O",
    "B-TODAY", "I-TODAY",
    "B-YESTERDAY", "I-YESTERDAY",
    "B-BLOCKERS", "I-BLOCKERS",
    "B-REPORT", "I-REPORT",
    "B-DATE", "I-DATE"
]
label2id = {label: i for i, label in enumerate(unique_labels)}
id2label = {i: label for label, i in label2id.items()}

# ---------------------------
# Tokenizer
# ---------------------------
tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")

# ---------------------------
# Tokenization and label alignment
# ---------------------------
def tokenize_and_align_labels(examples):
    tokenized_inputs = tokenizer(
        examples["tokens"],
        is_split_into_words=True,
        truncation=True,
        padding="max_length",
        max_length=128
    )
    
    aligned_labels = []
    for i, labels in enumerate(examples["labels"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        previous_word_idx = None
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                label_ids.append(label2id[labels[word_idx]])
            else:
                if labels[word_idx].startswith("B-"):
                    label_ids.append(label2id[labels[word_idx].replace("B-", "I-")])
                else:
                    label_ids.append(label2id[labels[word_idx]])
            previous_word_idx = word_idx
        aligned_labels.append(label_ids)
    
    tokenized_inputs["labels"] = aligned_labels
    return tokenized_inputs

train_dataset = train_dataset.map(tokenize_and_align_labels, batched=True)
val_dataset = val_dataset.map(tokenize_and_align_labels, batched=True)

train_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])
val_dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "labels"])

# ---------------------------
# Load model
# ---------------------------
model = BertForTokenClassification.from_pretrained(
    "bert-base-uncased",
    num_labels=len(unique_labels),
    id2label=id2label,
    label2id=label2id
)

# ---------------------------
# Move model to GPU
# ---------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
torch.cuda.empty_cache()

# ---------------------------
# Metrics
# ---------------------------
def compute_metrics(p):
    predictions, labels = p
    predictions = predictions.argmax(-1)
    
    true_predictions = [
        [id2label[p] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]
    true_labels = [
        [id2label[l] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]
    results = metric.compute(predictions=true_predictions, references=true_labels)
    return {
        "precision": results["overall_precision"],
        "recall": results["overall_recall"],
        "f1": results["overall_f1"],
        "accuracy": results["overall_accuracy"],
    }

# ---------------------------
# Training arguments
# ---------------------------
training_args = TrainingArguments(
    output_dir="./ner_final",
    eval_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=5,
    weight_decay=0.01,
    logging_dir="./logs_final",
    logging_steps=50,
    save_strategy="epoch",
)

# ---------------------------
# Trainer
# ---------------------------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics
)

# ---------------------------
# Train and save
# ---------------------------
trainer.train()
model.save_pretrained("./ner1_final")
tokenizer.save_pretrained("./ner1_final")
trainer.evaluate()

# ---------------------------
# Inference pipeline
# ---------------------------
ner_pipeline = pipeline(
    "token-classification",
    model="./ner1_final",
    tokenizer="./ner1_final",
    aggregation_strategy="simple"
)