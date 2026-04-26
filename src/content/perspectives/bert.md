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

The word "it" is easy enough for the model to generate. But the model builds a poor *representation* of what "it" refers to  - it could be the animal or the road. The ambiguity only resolves with the words that come *after*: 'tired' points to the animal, 'wide' points to the road.

So we have isolated the problem to the ambiguity of reference. When we are looking from left to right we are left with the ambiguity of the future tokens. Similarly, when we are looking from right to left we are left with the ambiguity of the past tokens.

You could then say we can run two parallel models from opposite directions and then concatenate the representation of 'it' from both models to get a better representation of the word. One representation comes only from the right context and the other comes only from the left context. This is actually what ELMo did, right before BERT.

### The case of ELMo

Two different representations of the same word 'it' are generated, one from the left context and one from the right context. But neither of them is aware of the other.

The right-context representation is without any knowledge of 'animal' and the left-context representation is without any knowledge of 'tired'. You glue them together but neither representation was formed with knowledge of the other side.

In BERT's self-attention, when building the representation for "it", the model attends to "animal" and "tired" simultaneously in the same attention computation. It can learn: "when I see 'tired' on the right AND 'animal' on the left, 'it' = animal." That joint reasoning in a single pass is what makes it truly bidirectional, not just bi-directional-then-glued.

### Why not just remove GPT's mask?

Why can we not use a single model that sees everything at once? Simply remove the causal masking so every token can attend to every other token, and train it to predict the next word  -

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

