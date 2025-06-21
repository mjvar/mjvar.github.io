---
layout: default
title: matthew // blog
---

# blogtastic!
<ul>
  {% for post in site.posts %}
    <li>
      <h3><a href="{{ post.url }}" target="_self">{{ post.title }}</a></h3>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>