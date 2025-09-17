---
layout: page
title: ""
permalink: /
nav_exclude: true
---

<section class="hero">
  <h1>Ramjan Khandelwal</h1>
  <p>Computer science student at VIT Chennai. I build web things, dabble in ML, and write when the quiet hours come. This is a compact snapshot of what I’m working on and thinking about.</p>
</section>

<section class="cta">
  <a class="btn" href="/about/">Learn more about me</a>
  <a class="btn" href="/blog/">Read the blog</a>
  <a class="btn" href="https://github.com/ravenZ3" target="_blank" rel="noopener">My GitHub</a>
</section>

<section class="featured-projects">
  <h2>Featured projects</h2>
  <ul>
    <li><a href="https://github.com/ravenZ3" target="_blank" rel="noopener">Things I’m building — quick peek on my GitHub</a></li>
    <li><a href="/projects/prompt-image-tool/">Prompt-based image editing tool (in progress)</a></li>
  </ul>
</section>

<section class="recent-posts">
  <h2>Recent posts</h2>
  <ul>
    {% for post in site.posts limit:3 %}
      <li>
        <time>{{ post.date | date: "%b %-d, %Y" }}</time>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        {% if post.tags %}
          <span class="meta">• {% for tag in post.tags %}<a href="{{ '/tags/#' | append: tag | relative_url }}">{{ tag }}</a>{% unless forloop.last %}, {% endunless %}{% endfor %}</span>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
  <p><a href="/blog/">See all posts →</a></p>
</section>

<section class="contact">
  <h2>Contact</h2>
  <p>Drop a note: <a href="mailto:ramjankhandelwal7@gmail.com">ramjankhandelwal7@gmail.com</a></p>
</section>
