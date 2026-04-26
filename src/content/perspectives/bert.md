---
title: "BERT"
stage: seedling
tags: [papers, nlp]
kind: note
date: 2024-09-23
description: Understanding what bidirectional pretraining actually does and why it matters.
---

## Why BERT?

The previous autoregressive models predicted the next word based on the previous tokens, but that could be limiting. Consider this case:

> "The animal didn't cross the road because it was too tired."
> "The animal didn't cross the road because it was too wide."

The word "it" is easy enough for the model to generate. But the model builds a poor *representation* of what "it" refers to: it could be the animal or the road. The ambiguity only resolves with the words that come *after*: 'tired' points to the animal, 'wide' points to the road.

So we have isolated the problem to the ambiguity of reference. When we are looking from left to right we are left with the ambiguity of the future tokens. Similarly, when we are looking from right to left we are left with the ambiguity of the past tokens.

You could then say we can run two parallel models from opposite directions and then concatenate the representation of 'it' from both models to get a better representation of the word. One representation comes only from the right context and the other comes only from the left context. This is actually what ELMo did, right before BERT.

### The case of ELMo

Two different representations of the same word 'it' are generated, one from the left context and one from the right context. But neither of them is aware of the other.

The right-context representation is without any knowledge of 'animal' and the left-context representation is without any knowledge of 'tired'. You glue them together but neither representation was formed with knowledge of the other side.

In BERT's self-attention, when building the representation for "it", the model attends to "animal" and "tired" simultaneously in the same attention computation. It can learn: "when I see 'tired' on the right AND 'animal' on the left, 'it' = animal." That joint reasoning in a single pass is what makes it truly bidirectional, not just bi-directional-then-glued.

### Why not just remove GPT's mask?

Why can we not use a single model that sees everything at once? Simply remove the causal masking so every token can attend to every other token, and train it to predict the next word:

Except that is straight up *cheating*. Without causal masking, every token position can directly see its own answer sitting right there in the input. The model just learns to copy. The loss drops to zero, it learns nothing useful.

This is called *trivial leakage*, and it is exactly why BERT uses MLM.

### The 80-10-10 Rule: Curing Mismatch
A subtle problem arises: during pre-training, the model only sees `[MASK]` tokens, but during fine-tuning (actual usage), it never sees them. To fix this "mismatch," BERT doesn't just replace everything with masks. For the selected 15% of tokens:
- **80%** are replaced with `[MASK]`
- **10%** are replaced with a **random word**
- **10%** are left **unchanged**

This forces the model to maintain a high-quality representation for *every* word, because any word might have been a "hidden" target. The model can't just ignore the non-mask tokens anymore.

## Next Sentence Prediction (NSP)
MLM is great for learning relationships between words. But what if we need to understand relationships between whole sentences (like in Question Answering or Entailment)?

BERT is trained to predict if Sentence B is the logical continuation of Sentence A. To do this, it introduces **Architectural Tokens**:

### 1. The `[CLS]` Token (Classification)
The `[CLS]` token is always the **very first** token. It has no meaning of its own (it's a "blank sponge"). Because BERT uses full self-attention, the `[CLS]` token gathers information from every other token in the sequence across all layers. By the final layer, its vector represents a **summary** of the entire sequence, which BERT uses for its final classification decision.

### 2. The `[SEP]` Token (Separator)
A special marker placed between Sentence A and Sentence B, and at the very end.

### 3. Segment Embeddings (The "Armband")
How does BERT know which word belongs to which sentence if they are in one big list? It adds a "Segment Embedding" (a unique vector for A vs B) to every single word. Every token is actually a sum of three layers:
- **Token**: The word itself.
- **Position**: Where it is in the 512-token sequence.
- **Segment**: Which sentence (A or B) it belongs to.

Combined, these allow BERT to "feel" the structure of the input and reason about how the two sentences relate.

## Architecture: The "Meaning Refinery"
BERT-Base consists of **12 Transformer layers** (or "floors"). As a word passes through these layers, it becomes increasingly contextualized.
- **Layers 1-4**: Basic syntax and parts of speech.
- **Layers 5-8**: Structural relationships.
- **Layers 9-12**: High-level semantic resolution (the "it" reference).

Each layer uses **Multi-Head Attention** (12 heads), which are like specialists looking at the same sentence for different features: grammar, references, and topics simultaneously.

## Fine-tuning: The Specialist
The true power of BERT is **Transfer Learning**. Just as a medical resident completes years of general school before specializing, BERT is "pre-trained" on the history of human language once and then specialized ("fine-tuned") for specific tasks.

By plugging a tiny new "Head" on top of the `[CLS]` token and training for just a few minutes, BERT can become an expert at:
- **Sentiment Analysis**: "Is this review happy?"
- **Question Answering**: "Where is the answer in this text?"
- **Named Entity Recognition**: "Which words are people or places?"

you can simply download the model and plug a head and suddenly you have an expert doing the task for you.

## Downfall
 - BERT is quite good at what it does but it has a limitaion by its bidirectional nature. It can not generate. Even if it wanted to generate the first word of the story, it would need to see the next words to do so.
It just can't start.

 *`but still bert is like a brilliant critic but it can't write the book for you. It can tell you prefect facts about it but writing but a vol ii is not in its abilities.`*

 - BERT is not a generative model. It is a discriminative model. GPT styled models function by given a certain sets of words, what will be the next word?
 It turns out instruction following is not very differnt from the next-word task. And because it can genereate tokens one after another, it can chat. You can't do that with bert in a natural manner.

 - Scaling
 When we scaled gpt to billions of parameters, something magical happened~ it become so good at predicting the next word that it accidently learned how to reason, write code, and follow complex logic without ever being explicitly fine tuned for it. 
 
 ## epilouge
 BERT is still used in critial infrastructure like spam classification or google search (research req.).
 But the frontend of AI has shifted to autoregressors like GPT and Claude.
> "Creation is more important than classification." 

