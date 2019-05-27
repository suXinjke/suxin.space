import DefaultLayout from '~/layouts/Default.vue'
import HeaderText from '~/components/header-text.vue'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { config, library } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
import {
    faAsterisk,
    faAt,
    faBullseye,
    faCarCrash,
    faChartLine,
    faCube,
    faComment,
    faDice,
    faDownload,
    faFile,
    faFileCode,
    faHome,
    faMedal,
    faNetworkWired,
    faPlane,
    faRocket,
    faStopwatch,
    faTimes,
    faUser,
    faVideo
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faAsterisk,
    faAt,
    faBullseye,
    faCarCrash,
    faChartLine,
    faCube,
    faComment,
    faDice,
    faDownload,
    faFile,
    faFileCode,
    faHome,
    faMedal,
    faNetworkWired,
    faPlane,
    faRocket,
    faStopwatch,
    faTimes,
    faUser,
    faVideo
)

import { faGrinSquintTears, faHourglass } from '@fortawesome/free-regular-svg-icons'
library.add( faGrinSquintTears, faHourglass )

import PortalVue from 'portal-vue'
import VueLazyload from 'vue-lazyload'

import 'normalize.css'
import '~/assets/fonts.css'

export default function ( Vue, { head } ) {
    Vue.component( 'Layout', DefaultLayout )
    Vue.component( 'HeaderText', HeaderText )
    Vue.component( 'font-awesome-icon', FontAwesomeIcon )

    Vue.use( PortalVue )
    Vue.use( VueLazyload )

    head.noscript.push( { innerHTML: `<style>.js-only {display: none !important;}</style>` } )
}
