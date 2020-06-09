<template>
    <div :class="{ 'header-text': true, 'header-text_marquee': marquee, 'header-text_status': status }" >
        <div class="header-text__icon-container" v-if="icon">
            <font-awesome-icon class="header-text__icon" :icon="[ iconStyle || 'fas', icon ]"/>
        </div>
        <div class="header-text__content" :title="title">
            <h3 class="header-text__secondary" v-if="headerSecondary">{{ headerSecondary }}</h3>
            <h2 class="header-text__primary" v-if="header" :style="headerStyle" ref="headerTextPrimary" @transitionend="onTransitionEnd">{{ header }}</h2>
        </div>
    </div>
</template>

<style lang="scss">
@import '@/assets/util.scss';

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
        opacity: 1;
        transition: opacity 0.2s linear;
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

    &_marquee &__primary {
        text-overflow: initial;
    }

    &_status &__icon {
        color: $color-dark;
    }

    &_status &__icon-container {
        background-color: $color-light;
    }

    &_status &__primary {
        font-size: 1.8em;
    }
}
</style>

<script>
export default {
    data: () => ( {
        marquee_moving: false
    } ),
    props: {
        icon: String,
        iconStyle: String,
        header: String,
        headerSecondary: String,
        marquee: Boolean,
        status: Boolean,
    },
    computed: {
        title: function() {
            let result = ''
            if ( this.headerSecondary ) {
                result += ( this.headerSecondary ) + ' - '
            }
            result += ( this.header || '' )
            return result.trim()
        },

        headerStyle: function() {
            if ( !this.marquee_moving ) {
                return ''
            }

            const { clientWidth, scrollWidth } = this.$refs.headerTextPrimary
            let offset = scrollWidth - clientWidth

            if ( offset === 0 ) {
                return ''
            }

            offset += 10

            const time = offset / 90

            return `
                margin-left: -${offset}px;
                opacity: 0;
                transition: margin-left ${time}s linear 0.6s, opacity 0.2s linear ${time+1.5}s;
            `
        }
    },

    watch: {
        marquee: function( newVal ) {
            this.marquee_moving = newVal
        }
    },

    methods: {
        onTransitionEnd: function( e ) {
            if ( e.propertyName === 'opacity' ) {
                this.marquee_moving = false
                if ( this.marquee ) {
                    this.marquee_moving = true
                }
            }
        }
    }
}
</script>