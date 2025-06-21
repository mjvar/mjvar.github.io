---
layout: default
title: matthew // blog
---
# blogtastic!
<p>assorted thoughts about a variety of topics</p>

<ul>
  {% for post in site.posts %}
    <li>
      <h3><a href="{{ post.url }}">{{ post.title }}</a> ({{ post.date | date_to_string }})</h3>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>