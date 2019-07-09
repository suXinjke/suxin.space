<template>
    <div>
        <header class="header">
            <nav class="nav header__nav">
                <g-link class="nav__link nav__link_exact" to="/">
                    <HeaderText icon="home" header="HOME"/>
                </g-link>
                <g-link class="nav__link nav__link_expand" to="/notes/">
                    <HeaderText icon="file" header="NOTES" :header-secondary="noteTitle"/>
                </g-link>
            </nav>
            <component :is="titlePage ? 'h1' : 'h2'" class="header__logo">
                suXin space
            </component>
        </header>
        <transition name="page" appear>
            <main>
                <slot/>
            </main>
        </transition>
    </div>
</template>

<style lang="scss">
@import '@/assets/util.scss';

body {
    font-family: 'Aileron', 'Helvetica', 'Arial', sans-serif;

    color: $color-dark;
    background-color: $color-light;
}

#app {
    margin: 0 auto;
    padding: 0 16px;

    @include xl {
        max-width: 1280px;
    }
}

.readable {
    p, li {
        line-height: 1.375em;
    }

    .hljs {
        font-size: 0.875em;
        line-height: 1.2em;
    }
}

pre, code {
    font-family: Consolas, monaco, monospace;
}

.anchor-link {
    text-decoration: none;
    color: $color-dark;
    margin-left: 0.25rem;
    visibility: hidden;

    *:hover > & {
        visibility: visible;
    }
}

.page-enter-active {
    transition: opacity 0.2s;
}
.page-enter {
    opacity: 0;
}

.nav {
    display: flex;
    flex-direction: column;

    @include sm {
        flex-direction: row;
    }

    &__link {
        text-decoration: none;
        color: $color-dark;

        padding: 0.5em 0.75em;

        &_exact.active--exact,
        &:not(&_exact).active {
            background-color: $color-primary;
        }

        &_expand {
            overflow: hidden;
        }
    }
}

.header {
    display: flex;
    flex-direction: column;
    @include sm {
        flex-direction: row;
    }

    margin: 1em 0;

    &__logo {
        margin: 0;
        font-size: 2rem;
        font-weight: 900;

        order: -1;
        align-self: center;
        margin: 0 0 0.5em 0;

        @include sm {
            order: initial;

            margin: 0 0 0 auto;
        }
    }

    &__nav {
        flex: 1;
        min-width: 0;
    }
}
</style>

<script>
export default {
    props: {
        noteTitle: {
            type: String,
            default: ''
        },
        titlePage: {
            type: Boolean,
            default: false
        }
    },

    metaInfo() {
        return {
            link: [
                { rel: 'canonical', href: `${process.env.GRIDSOME_BASE_URL}${this.$route.path}` }
            ]
        }
    }
}
</script>