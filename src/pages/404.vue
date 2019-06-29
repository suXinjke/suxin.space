<template><Layout :titlePage="true">
    <div class="frog">
        <img class="frog__image" src="/frog.png"/>
        <div class="frog__message">
            <h2 class="frog__404"><strong>404</strong></h2>
            <h3 class="frog__not-found">Not found</h3>
        </div>
    </div>
</Layout></template>

<script>
export default {
    metaInfo() {
        return {
            title: 'Not found'
        }
    }
}
</script>

<style lang="scss">
.frog {
    display: flex;
    justify-content: center;

    &__image {
        max-width: 8rem;
        height: auto;
        margin: 0 1rem 0 0;
    }

    &__message {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    &__404 {
        font-size: 3em;
        margin: 0;
    }

    &__not-found {
        font-size: 2em;
        margin: 0;
    }
}
</style>