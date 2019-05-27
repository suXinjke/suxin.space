<template>
    <div :class="{ 'header-text': true }" >
        <div class="header-text__icon-container" v-if="icon">
            <font-awesome-icon class="header-text__icon" :icon="[ iconStyle || 'fas', icon ]"/>
        </div>
        <div class="header-text__content" :title="title">
            <h3 class="header-text__secondary" v-if="headerSecondary">{{ headerSecondary }}</h3>
            <h2 class="header-text__primary" v-if="header">{{ header }}</h2>
        </div>
    </div>
</template>

<style lang="scss">
.header-text {
    display: flex;
    align-items: center;

    &__icon-container {
        width: 2em;
        height: 2em;

        display: flex;
        align-items: center;
        justify-content: center;

        margin: 0.15em 0.5em 0.15em 0;
        border: 0.15em solid;
        border-radius: 0.25em;
    }

    &__icon {
        width: 80% !important;
        height: 80% !important;
    }

    &__content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;

        overflow: auto;
        white-space: nowrap;
    }

    &__primary {
        font-weight: 900;
        font-size: 1.3em;
        margin: 0;
    }
    &__secondary {
        font-weight: 400;
        font-size: 0.9em;
        margin: 0;
    }

    &__primary, &__secondary {
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>

<script>
export default {
    props: {
        icon: String,
        iconStyle: String,
        header: String,
        headerSecondary: String
    },
    computed: {
        title: function() {
            let result = ''
            if ( this.headerSecondary ) {
                result += ( this.headerSecondary ) + ' - '
            }
            result += ( this.header || '' )
            return result.trim()
        }
    }
}
</script>