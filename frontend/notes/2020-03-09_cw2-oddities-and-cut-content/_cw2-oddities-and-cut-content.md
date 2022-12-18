---
title: 'Colony Wars Vengeance oddities and cut content'
date: '2020-03-09'
description: Unused skins and ships, and also small insights into development process of Colony Wars Vengeance, a Playstation space dogfighting game.
showcase:
    - image: ./NMEDIC_0_large.png
    - image: ./BHEX_0_large.png
      imagePos: 0% 25%
    - image: ./LWRAITH_0_large.png
      imagePos: 0% 25%
seeAlso:
    - cw3-oddities-and-cut-content
    - cw-vengeance-reverse-engineering-models
---

## **Playable ship skins?**

After checking the extracted models, several unused skins of playable ships were found. Each skin is prefixed with a letter, I'd guess **B** stands for **Bloody**, **L** for **Leopard**, **T** for... *techy?*

Note that all ships with **L** and **T** skins have a portion of their mesh with the original Navy texture.

$tabs hex
![BHEX](./BHEX_0_large.png)
![LHEX](./LHEX_0_large.png)
![THEX](./THEX_0_large.png)
![Original Hex](./NHEX_0_large.png)

$tabs wraith
![BWRAITH](./BWRAITH_0_large.png)
![LWRAITH](./LWRAITH_0_large.png)
![TWRAITH](./TWRAITH_0_large.png)
![Original Wraith](./NWRAITH_0_large.png)

$tabs diablo
![BDIABLO](./BDIABLO_0_large.png)
![LDIABLO](./LDIABLO_0_large.png)
![TDIABLO](./TDIABLO_0_large.png)
![Original Diablo](./NDIABLO_0_large.png)

$tabs voodoo
![BVOODOO](./BVOODOO_0_large.png)
![LVOODOO](./LVOODOO_0_large.png)
![TVOODOO](./TVOODOO_0_large.png)
![Original Voodoo](./NVOODOO_0_large.png)

## **AFLEET2**

While it's form mostly resembles the **Alien Battleship** that we see in-game, the texture is more of what you find on regular tiny alien ships (included in **AACE** tab for comparison). Part of me wants to think that Aliens were added late in development and design wasn't 100% agreed upon, because one mission even includes fueling station which doesn't have anything alien about it at all (unless aliens captured it, but we'll never know).

The model looks like it's missing a part, I'm not sure if it's unfinished or a mistake in my model parser.

$tabs aliens
![AFLEET2](./AFLEET2_0_large.png)
![AFLEET1 (Original)](./AFLEET1_0_large.png)
![AACE](./AACE_0_large.png)

## **MEDIC**

![Yep, that's me, you're probably wondering how I ended up in this game](./LMEDIC_guy.png)

Some unused capital ship, which includes a peculiar face of person I have no idea about. **LMEDIC** and **NMEDIC** file names suggest this ship could probably assist and repair the others. Has both **League** and **Navy** skins.

$tabs medic
![LMEDIC](./LMEDIC_0_large.png)
![NMEDIC](./NMEDIC_0_large.png)

## **ECO**

This one is not used anywhere and doesn't seem to be leftover from original **Colony Wars** either. There are **LECO** and **NECO** files, suggesting both **League** and **Navy** could have it, and yet they look exactly same, suggesting **ECO** was not finished.

![LECO.BND / NECO.BND](./LECO_0_large.png)

## **LBCARR**

This huge **League carrier** also doesn't seem to be used anywhere.

![LBCARR.BND](./LBCARR_0_large.png)

## **Loading screens**

The original loading screen always blew my mind when I was a kid. Nowadays I've got to see what I expected: just a single and small portion of tunnel, which is duplicated into a stretching line in-game. What's also interesting is that the mesh **XYZ Scale** accommodates the ship size of your choice.

$tabs loading
![Loading screen tunnel](./tunnel.png)
![In-game](./loading-tunnel.jpg)

In case of jumpgate loading screen, it's just a huge cylinder. I guess it's also duplicated and stretched, in-game it has darker and orange-ish tones that could be part of lighting work.

$tabs loading2
![Loading screen warp tunnel](./tunnel_warp.png)
![In-game](./loading-warp.jpg)

## **Navy logo?**

This might be far fetched, but executable file **SLUS_007.22** on the disc has several bytes that I think could resemble **Navy logo**. Obviously the way thing on the left look depends on display width. If you tweak it, it will look like one ship instead of two.

If you want to see for yourself, just CTRL+F **GAME.RSC** string, it's located below the logo, followed by huge amount of nulls.

![Navy logo on SLUS_007.22?](./navy.png)

## **Text findings**

### **LATEST~1.TXT**

A small changelog shipped with all game copies:

```break-space
THIS DOC WILL TRACK ALL THE LATEST CHANGES TO THE CNF FILES.
(NEWEST AT THE TOP)

25/6/98 Damage values for player controlled strike cannon set to 500 shield 1000 hull.
20/6/98 Added damage value to alien torpedo. Now 200.
18/6/98 Iso damage raised from 500 to 1000
16/6/98 New Dship.CNF for Dropship. Hex controls and Diablo's speed.
15/6/98 Guns cool a little slower
8/6/98	Plasma cannon damage raised to 35
8/6/98	Changed Leech beam drain rate to 75%
8/6/98	Changed Plasma cannon damage to 25 to match the new effect.
4/6/98	Leach Beam damage has been reduced. (but is probably still too powerful due to the way damage is worked.
4/6/98	Isotope damage increased to 500 per hit.
```

### **Dev names for entities**

Mission scripts have additional labels for each entity used, which are not shown anywhere in the game, and some of them have what I presume developer names. Maybe that way they marked who's responsible for scripting certain ship during that mission.

I want to believe these correspond to **Design Team**: **Chris Graham**, **Andy Santos** and lead **Mike Ellis**.

```
// 3_3.CW
;------League Frigate(Chris)------
shipid		1
shiptmd		LFRIGATE
shiptype		3

// 12_1.CW
;------(NF)Diablo (Andy)------
shipid		9
shiptmd		NDIABLO
shiptype		1

// 15_1.CW
;------Navy Battle Cruiser (Mike2)------
shipid		2
shiptmd		NCRUISER
shiptype		3
// ...
;------Navy Battle Cruiser (Mike1)------
shipid		3
shiptmd		NCRUISER
shiptype		3

// 12_3.CW
// Well, Andy, what's up with calling models after yourself?
;------(Super)Jump Missile (Navy)------
shipid		7
shiptmd		JUMPANDY
shiptype		1
```

### **Dialogue**

Several dialogue and corresponding subtitles were apprarently cut and commented out. Sometimes it's accompanied with comments, including some snarky ones for **Chris Graham**:

```break-space
// 1_1.MSG
;CHUNKY CHRIG G DOESNT WANT THIS SAMPLE !
;42	m_time		0	0	120	10	Navy Battleship to Mertens : We'll cover the convoy - you remove the hostile threat.


// 1_2.MSG
;CHRIS G DOESNT WANT THIS SAMPLE!
;Hey Mertens - Klein here .. if you have any probe pods, you can use 'em to scan the asteroids for crystals.

;42	m_tractored		CRYSTAL		0	0	9	Navy Battleship to Mertens. Keep an eye on us while we tractor this stuff over.


// 1_3.MSG
// Two amusing attempts at writing one thing
;[As player and pod close to platform]
;This is Ops : That will be close enough. Drop the pods and the platform will reel them in.

;[As player and pod close to platform]
;42	m_			0		0	0	10	Klein to Mertens. That will be close enough. Drop the pods and the platform will reel them in.

// 2_1.MSG
// Construction rig destruction mission includes what could probably be Klein's lines

;[Player destroys rig section only for it to be replaced]
;Ops! As soon as I take out a section, another appears!

42	m_destroyed	CONRIG		1	0	14	Get outta here!

;[Player approaches sentinel]
;This thing ain't that small!

// 8_1.MSG
;Becks to Mertens : Good work. We make one helluva team!


// 9_2.MSG
;I am the Widowmaker So we meet at last (eek! Corny as hell) your reputation precedes you your reputation will also die with you


// 10_1_2.MSG
;NOTE THIS IS A BODGE - WE JUST NEED SUCCESS MARKING
42	m_success	0		0	0	0	Well done pilot : League preparations have been disrupted.


// 12_3.MSG
// Mission with probing and targeting capital ships for jump missiles.
// It was probably planned you you'd have to escape by yourself
;42	m_id_gt			JUMPMISS	0	0	4	Drake to Mertens : Navy Ops will soon target jump missiles through the jumpgate. Exit sector through jumpgate when it appears.

;You are targeting civilian craft

;This is Ops: Escape jumpgate open in 10, 9, 8, 7, 6, 5, 4, 3, 2, 1. Jumpgate open

;42	m_player_attacked_me	NWRAITH		0	0	11	Drake to Mertens : advisory - avoid targeting civilian craft.


// 13_3.MSG
// Personal Kron appreciation
;Becks? Watchleader Becks?

;Well done my subject. You have served your leader well - you will be rewarded when the conflict is complete.


// 16_3.MSG
// Mining and reflective disc installation mission.
// It was probably planned to be done in one phase rather than two in release, which is something that can be seen in plenty of mission scripts (or maybe just done for some convenience).
// Drake also suggested using Lance while in release version you can damage it with any weapon.

;Mission Objectives - destroy crystals and replace with reflective discs before alien weapon is fired.

;Beam up power detected

;Beam is ready to fire

;One amplification disc destroyed. Navy fleetcraft will launch reflective replacement discs through a local jumpgate. Seek and grapple into place.

;Drake to Mertens - intelligence reports to our labs indicate that only one weapon will be capable of damaging the discs. We are as yet unsure which weapon this is..

;Drake to Mertens - labs have indicated that the Seismic Lance will damage the discs.


// 17_1_2.MSG
;in 17_1_2
;This is Ops - ensure you scan the jumpgates in order that we can gain more information about the hostile unknown.
```

### **FRONT.OVL**

Apparently a file with game related code includes *hello* to someone's mom

![MUM](./MUM.png)

## **Additional info**

* Several ships that only **Navy** has in-game, also have **League** version. I decided not to include pics of them as they're not that interesting: basically a color swap like of that on **MEDIC**.
* There's plenty of leftover content from original **Colony Wars**: several ship models and database info (the one that was accessible from main menu).