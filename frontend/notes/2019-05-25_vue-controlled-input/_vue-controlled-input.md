---
title: Vue Controlled Input - using v-model and watch
date: '2019-05-25'
description: Lampshading the way to make an input actually controlled while keeping it simple with v-model and watch.
image: ./vue.png

headScripts:
    - ./react-example.js
    - ./vue-example.js
---

## **What I want**

<div id="react-example">
</div>

### **Vue**

```js
<template>
    <div>
        Value: <input v-model="value"/>
    </div>
</template>

<script>
export default {
    data: () => ( {
        value: ''
    } ),

    watch: {
        value: function( newValue ) {
            newValue = newValue.replace( /[^\d]/g, '' ).trim()
            if ( newValue.length > 0 ) {
                newValue = newValue + '$'
            }
            this.value = newValue
        }
    }
}
```

### **Compared to React**

```js
class ControlledInput extends React.Component {
    constructor() {
        super()
        this.state = {
            value: '',
        }

        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        let value = e.target.value.replace(/[^\d]/g, '').trim()
        if (value.length > 0) {
            value = value + '$'
        }
        this.setState({ value: value })
    }

    render() {
        return (
            <div>
                Value: <input value={this.state.value} onChange={this.onChange} />
            </div>
        )
    }
}
```

## **About getting there**

At first I was very surprised to not find anything similar to this solution. Searching **Vue controlled input** only gave me **one blog post** and some **StackOverflow answers**, most of them not solving the problem in a way I want, going around it or being more complex than it should.

Some websites may have an input with very strict validation: be it telephone number, amount of money, or something else that implies an input mask. Formatting the input as you type it may ease checking whatever that's typed for user. It's much easier to read **4093 8123 9332 8423 8495** rather than **40938123933284238495**.

Unfortunately we don't have much options when it comes to formatting and styling text input like that. **Whatever is inside the text input must be represented as the plain text string.**

Solving this problem with **React** seems trivial, because when you pass the state to the **value** attribute of the **input** - **it's dead locked**, that state is now single source of truth for this input and you're free to apply additional formatting to the value when it changes. It's still possible to set incorrect state but it would be coming from your **React** code, not user input.

I failed to follow similar approach in **Vue**. If instead of using **v-model** you go for similar binding of **value** and declaring **@change** event - it's not going to be as strict in **React**, in fact you can avoid handling value change part - it will remain out of sync just fine. Compared to **React**, **@change** also executes only after you're done with the input (blur/go out of focus), _which is actually how it's supposed to work_, something I didn't know about before.

You can use **@input** instead of **@change** to get similar behaviour, but sync problems remain.

Binding it to the **computed value** won't help either, you can still freely type in the input.

This made me wonder if the only way to do it would be by overriding events like **onkeydown** and preventing them if incorrect characters are entered, but you'll have to make sure to catch all other events like **onpaste**, this seems worse to maintain compared to **React** approach.

The last idea involved changing **value** attribute of the **inputs** directly via **$ref**, I can't even remember exactly what I did with these, but some of the solutions found on the internet follow this approach and it may be sufficient enough, but it's still a hacky solution.

**Here's what I found by searching for _Vue controlled input_:**

-   [**Building a controlled Vue input component**](https://bangjelkoski.com/blog/building-a-controlled-vue-input-component): It's just about passing the value deep down your component chain via props and catching the changes in the parent, all of the issues specified are still there.
-   [**vue controlled input gist**](https://gist.github.com/Jokcy/0789228b25d73f6a017b0b04e01ae34a): this is an example of doing it with **$ref**. Not sure why **onchange** is handled here, the **currentValue** doesn't make sense to me because a **value prop** is applied via **$ref** directly. If I handle formatting on upper level - I'm still able to type incorrect characters.
-   [**StackOverflow - Vue controlled inputs**](https://stackoverflow.com/questions/55195878/vue-controlled-inputs): tons of use `input="number"` or specific keyboard events.
-   [**StackOverflow - Filter input text only accept number and dot vue.js**](https://stackoverflow.com/questions/39782176/filter-input-text-only-accept-number-and-dot-vue-js): once again a ton of keyboard event suggestions, there's **Directive** approach mentioned that some people still put keyboard events into, and hacking around _"if you type more than one letter the second one sometimes goes through"_ would also be just as unpleasant.
-   [**StackOverflow - Writing custom form controls to use v-model in Vue.js**](https://stackoverflow.com/questions/43568635/writing-custom-form-controls-to-use-v-model-in-vue-js): hey, this actually hints at the **watch** approach similar to mine, _that I failed to notice until I started writing this note_.
-   [**npm - vue-controlled-input**](https://www.npmjs.com/package/vue-controlled-input): same as above - I decided only to look into this package with no GitHub repo only because I'm writing this note, and surprisingly, **it has exactly the same approach that I got**.

While two latter results are still on top of Google search, it takes effort or some desperation to notice the **watch** approach in making the input controllable. This is why I decided to write this note, to lampshade this simple way of doing it.

**I tried to search for something other than _controlled input_ afterwards:**

-   [**v-money**](https://github.com/vuejs-tips/v-money): does it exactly the way I would like, and [if you peek inside the code](https://github.com/vuejs-tips/v-money/blob/8874322/src/component.vue#L59) - it's the same watch approach.
-   [**vue-numeric**](https://kevinongko.github.io/vue-numeric/): formatting only after you're done with the input is questionable, it's one of the approaches I also saw on **StackOverflow**. It may suit some people who type while looking at the keyboard - because they will see all typos which then should disappear, but I don't like that caret is always set at the end of the input when you focus and that edited value may be hard to read.
-   [**JSFiddle - Formatted currency input component using Vue.js**](https://jsfiddle.net/mani04/bgzhw68m/): similar approach to **vue-numeric**, implementation is complex, resolving around computed property with getter and setter.

## **Another bonus example**

The example at the top is simplified and is only supposed to demonstrate the approach. [How about something more real, like adding spaces to the number to maintain readability?](https://codesandbox.io/s/4qpzyp7pl9?file=/src/App.vue)

<div id="vue-example"></div>

Here, **$ref** is still required to extract the input's caret position and calculate a new one, to ensure that you will have good experience without caret jumping around.

Please don't mind the code for adding spaces, I'm sure there's a better way for that.

By the way, due to the nature of **watch**, even if you change the data by other means than input - it still will be formatted properly, and I like that.