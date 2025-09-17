---
layout: page
title: "Tags"
permalink: /tags/
---

<ul>
  {% for tag in site.tags %}
    {% assign name = tag[0] %}
    {% assign posts = tag[1] %}
    <li>
      <a href="#{{ name | slugify }}">{{ name }}</a> ({{ posts.size }})
    </li>
  {% endfor %}
</ul>

{% for tag in site.tags %}
  {% assign name = tag[0] %}
  {% assign posts = tag[1] %}
  <h2 id="{{ name | slugify }}">{{ name }}</h2>
  <ul>
    {% for post in posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
      </li>
    {% endfor %}
  </ul>
{% endfor %}
