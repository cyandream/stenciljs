import { Component, Listen, Prop, State } from '@stencil/core';
import { MatchResults } from '@stencil/router';
import { ToastController } from '@ionic/core';
import {urlB64ToUint8Array} from "../../helpers/utils";


@Component({
    tag: 'app-thank-you',
    styleUrl: 'app-thank-you.scss'
})

//Most of this stuff is copied from the app-profile component
export class AppThankYou {

    @Prop() match: MatchResults;
    @Prop({ connect: 'ion-toast-controller' }) toastCtrl: ToastController;

    @State() notify: boolean;
    @State() swSupport: boolean;

    // demo key from https://web-push-codelab.glitch.me/
    // replace with your key in production
    publicServerKey = urlB64ToUint8Array('BBsb4au59pTKF4IKi-aJkEAGPXxtzs-lbtL58QxolsT2T-3dVQIXTUCCE1TSY8hyUvXLhJFEUmH7b5SJfSTcT-E');

    componentWillLoad() {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            this.swSupport = true;
        } else {
            this.swSupport = false;
        }
    }

    @Listen('ionChange')
    subscribeToNotify($event: CustomEvent) {
        console.log($event.detail.checked);

        if ($event.detail.checked === true) {
            this.handleSub();
        }
    }

    handleSub() {
        // get our service worker registration
        navigator.serviceWorker.getRegistration().then((reg) => {

            // check if service worker is registered
            if (reg) {
                // get push subscription
                reg.pushManager.getSubscription().then((sub) => {

                    // if there is no subscription that means
                    // the user has not subscribed before
                    if (sub === null) {
                        // user is not subscribed
                        reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: this.publicServerKey
                        })
                            .then((sub: PushSubscription) => {
                                // our user is now subscribed
                                // lets reflect this in our UI
                                console.log('web push subscription: ', sub);
                                this.notify = true;
                            })
                    }
                })
            }
        })
    }

    getJsonFromUrl() {
        var query = location.search.substr(1);
        var result = {};
        query.split("&").forEach(function (part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    render() {
        var params = this.getJsonFromUrl();
        const name = params['name'];
        const url = 'https://www.bradyid.com/owner/' + params['modelNum'];

        return (
            <ion-page>
                <ion-header>
                    <ion-toolbar color='primary'>
                    <div class="iconTitle">
                        <img src="../../assets/icon/mstile-70x70.png" class="icon"/>
                        <ion-title>Product Registration</ion-title>
                        </div>
                        <div class="onlineWrapper">
                            <div class="circle ">
                                <div class="pulse_rays"></div>
                            </div>
                            <div class="text">ONLINE</div>
                        </div>
                    </ion-toolbar>
                </ion-header>
                <ion-content>
                    <ion-scroll>
                        <h1>Thank you, {name}!</h1>
                        <div class="checkboxContainer">
                            <img src="../../assets/icon/check.svg" class="check"/>
                        </div>
                        <a href={url}>
                            <ion-button>
                                View Owner Page
                            </ion-button>
                        </a>
                    </ion-scroll>
                </ion-content>
            </ion-page>
        );
    }
}
