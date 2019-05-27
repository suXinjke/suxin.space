---
title: BLENDER GOLDSOURCE EXPORT
subtitle: CONTRIBUTION
icon: file-code
image: /img/blender_goldsource.png
imagePos: 80% 80%
---
While working on **Half-Payne**, I had to modify existing 3D models
or export the others. Initially, the workflow was like this:

* Modify model in **Blender**
* Export SMD with **Blender Source Tools**
* Import SMD in **Milkshake 3D**
* Export SMD again, but now it can be consumed by **studiomdl**
* Process SMD with **studiomdl**, model is now ready to use in-game

**I could not stand this waste of time**, and I had no idea how others could if they
would end up in simillar situation.
**Blender** is such a great 3D editor and there
was no other alternative when it comes to exporting.


The reason why SMD files produced by **Blender Source Tools** could not
be used by **studiomdl** was the incorrect **bone output**.
Fixing this issue wasn't too difficult and I saw this as an opportunity
to contribute and [try out GitHub Pull Requests](https://github.com/Artfunkel/BlenderSourceTools/pull/1).


In the end, [the changes were officially included in 2.9.0 update](https://steamcommunity.com/groups/BlenderSourceTools#announcements/detail/484538095737201475).
