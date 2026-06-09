# Pain Scoring Formula

## Base Formula

```
pain_score = (engagement * 2) + (discussion * 1.5) + keyword_bonus
```

### Source-Specific Breakdown

| Source | Engagement Metric | Discussion Metric | Weight |
|--------|------------------|-------------------|--------|
| Reddit | Upvotes | Comments | upvotes*2 + comments*1.5 |
| HN | Points | Comments | points*2 + comments*1.5 |
| GitHub Issues | N/A | Comments | comments*3 |

### Keyword Bonus (+5 per match)

Pain indicators that add 5 points each when found in title or body:

- **Frustration:** frustrated, annoyed, hate, worst, terrible, disappointed, regret
- **Problems:** pain, problem, issue, bug, broken, fail, difficult, hard
- **Cost:** expensive, cost, pricing, overpriced, "not worth"
- **Missing:** missing, lack, need, want, wish, "would be nice"
- **Switching:** alternative, switching, left, moved, quit, stopped
- **Warnings:** warning, avoid, beware
- **Support:** support, help, stuck, confused, unclear, documentation

### Minimum Threshold

Signals with `pain_score < 10` are filtered out before clustering.

### Why This Formula

- **Engagement * 2:** A post with 1,000 upvotes about pricing pain is stronger than 100 posts with 10 upvotes each. Engagement indicates resonance.
- **Discussion * 1.5:** Comments indicate the pain is complex enough to warrant debate and multiple perspectives.
- **Keyword bonus:** Explicit pain language confirms the signal is about a problem, not a neutral or positive post.

### Example Calculation

```
Reddit post:
  Title: "Why is [Competitor] so expensive? We are switching."
  Upvotes: 234
  Comments: 89
  Keywords matched: expensive (+5), switching (+5)

Score = (234 * 2) + (89 * 1.5) + 10
      = 468 + 133.5 + 10
      = 611.5 → 612
```

This is a high-pain signal and would rank in the top 60 for clustering.

---

*Reference for map-your-market skill*
