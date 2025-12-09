from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
import torch
from datasets import Dataset
import pandas as pd
import os

print("hello")
print("Current working directory:", os.getcwd())
print("Files in current directory:", os.listdir())

# Load your CSV
df = pd.read_csv("data.csv")

print(df.head())

# Map numeric labels to text (for reference)
label_map = {
    0: "log_update",
    1: "query_update",
    2: "update_entry",
    3: "unknown"
}

# Create Dataset object
dataset = Dataset.from_pandas(df)

# ---------------------------
# Tokenizer & Model
# ---------------------------
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
model = BertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=4)

# ---------------------------
# Move model to GPU if available
# ---------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)
torch.cuda.empty_cache()  # clear GPU memory

# ---------------------------
# Tokenization
# ---------------------------
def tokenize(batch):
    return tokenizer(batch["text"], padding=True, truncation=True)

dataset = dataset.map(tokenize, batched=True)
dataset = dataset.remove_columns(["text"])
dataset.set_format("torch")
print(dataset)

# ---------------------------
# Train/Test Split
# ---------------------------
dataset_split = dataset.train_test_split(test_size=0.2, seed=42)
train_dataset = dataset_split["train"]
eval_dataset = dataset_split["test"]

# ---------------------------
# Training Arguments
# ---------------------------
training_args = TrainingArguments(
    output_dir="./bert-intent",
    num_train_epochs=6,
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    save_strategy="no",
    logging_dir="./logs",
    logging_steps=10,
)

# ---------------------------
# Trainer
# ---------------------------
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

# ---------------------------
# Train & Save
# ---------------------------
trainer.train()
model.save_pretrained("./bert-intent")
tokenizer.save_pretrained("./bert-intent")
