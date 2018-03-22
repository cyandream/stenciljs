import { Component } from '@stencil/core';
import { State } from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import { Prop } from '@stencil/core';
import { MatchResults } from '@stencil/router';
@Component({
    tag: 'app-home',
    styleUrl: 'app-home.scss'
})
export class AppHome {

    @Prop() match: MatchResults;
    @Prop() history: RouterHistory;

    @State() firstName: string;
    @State() lastName: string;
    @State() emailAddress: string;
    @State() serialNumber: string;
    @State() productNumber: string;
    @State() productName: string;

    postData(url, data) {
        // Default options are marked with *
        return fetch(url, {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data), // must match 'Content-Type' header
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
            .then(response => response.json()) // parses response to JSON
    }

    submitForm(e) {
        e.preventDefault()

        if (this.serialNumber == null) {
            this.serialNumber = this.match.params.serialNum;
        }

        if (this.productNumber == null) {
            this.productNumber = this.match.params.modelNum;
        }

        var regArray = [];
        var regObject =
            {
                "Serial_Number": this.serialNumber,
                "First_Name": this.firstName,
                "Last_Name": this.lastName,
                "Email": this.emailAddress,
                "Product_Number": this.productNumber,
                "Product_Name": this.productName,
                "Product_Image": null,
                "Product_Manual_Link": null
            };

        regArray.push(regObject);

        this.postData('https://bpr-api-prod.azurewebsites.net/api/ProductRegistration', regArray)
            .then(data => console.log(data))
            .catch(error => console.error(error));

        this.history.push('/thankyou/?name=' + this.firstName + '&modelNum=' + this.productNumber, {});
    }

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleEmailAddressChange(event) {
        this.emailAddress = event.target.value;
    }

    handleSerialNumberChange(event) {
        this.serialNumber = event.target.value;
    }

    handleProductNumberChange(event) {
        this.productNumber = event.target.value;
    }

    handleProductNameChange(event) {
        this.productName = event.target.value;
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
        if (params['modelNum'] != null) {
            this.productNumber = params['modelNum'];
        }
        if (params['serialNum'] != null) {
            this.serialNumber = params['serialNum'];
        }

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
                    <form onSubmit={(e) => this.submitForm(e)}>


                            <ion-item>
                                <ion-label fixed>Model Number</ion-label>
                            <ion-input type="text" value={this.productNumber} onInput={(event) => this.handleProductNumberChange(event)}></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label fixed>Serial Number</ion-label>
                            <ion-input type="text" value={this.serialNumber} onInput={(event) => this.handleSerialNumberChange(event)}></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label fixed>First Name</ion-label>
                                <ion-input type="text" value={this.firstName} onInput={(event) => this.handleFirstNameChange(event)}></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label fixed>Last Name</ion-label>
                                <ion-input type="text" value={this.lastName} onInput={(event) => this.handleLastNameChange(event)}></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label fixed>Email Address</ion-label>
                                <ion-input type="email" value={this.emailAddress} onInput={(event) => this.handleEmailAddressChange(event)} ></ion-input>
                            </ion-item>
                            <ion-item>
                                <input ion-button margin-top type="submit" value="Register" class="btSubmit" />
                            </ion-item>
                    </form>
                </ion-content>
                <ion-footer>
                    <div class="toolbarFooter">
                        <ion-button ><svg fill="#FFFFFF" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="3.2"/>
                            <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg></ion-button>
                     </div>
                </ion-footer>
            </ion-page>
        );
    }
}
