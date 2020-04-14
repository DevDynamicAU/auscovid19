<template>
	<div>
		<CCard>
			<CCardBody>
				<CRow>
					<CCol sm="5">
						<h4 id="traffic" class="card-title mb-0">Active Cases (Australia)</h4>
					</CCol>
					<CCol sm="7" class="d-none d-md-block">
						<CButton color="primary" class="float-right d-none">
							<CIcon name="cil-cloud-download" />
						</CButton>
						<CButtonGroup class="float-right mr-3 d-none">
							<CButton
								color="outline-secondary"
								v-for="(value, key) in ['Day', 'Month', 'Year']"
								:key="key"
								class="mx-0"
								:pressed="value === selected ? true : false"
								@click="selected = value"
							>
								{{ value }}
							</CButton>
						</CButtonGroup>
					</CCol>
				</CRow>
				<ActiveChart 
					style="height:500px; margin-top:40px;"
					:chartData="ActiveCases"
					:lineWidth=3 />
			</CCardBody>
		</CCard>
		<CCard>
			<CCardBody>
				<CRow>
					<CCol sm="5">
						<h4 id="traffic" class="card-title mb-0">Confirmed Cases (Australia)</h4>
					</CCol>
					<CCol sm="7" class="d-none d-md-block">
						<CButton color="primary" class="float-right d-none">
							<CIcon name="cil-cloud-download" />
						</CButton>
						<CButtonGroup class="float-right mr-3 d-none">
							<CButton
								color="outline-secondary"
								v-for="(value, key) in ['Day', 'Month', 'Year']"
								:key="key"
								class="mx-0"
								:pressed="value === selected ? true : false"
								@click="selected = value"
							>
								{{ value }}
							</CButton>
						</CButtonGroup>
					</CCol>
				</CRow>
				<ConfirmedChart 
					style="height:300px; margin-top:40px;"
					:chartData="ConfirmedCases"
					:lineWidth=3 />
			</CCardBody>
			<CCardFooter class="d-none">
				<CRow class="text-center">
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">Visits</div>
						<strong>29.703 Users (40%)</strong>
						<CProgress
							class="progress-xs mt-2"
							:precision="1"
							color="success"
							:value="40"
						/>
					</CCol>
					<CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
						<div class="text-muted">Unique</div>
						<strong>24.093 Users (20%)</strong>
						<CProgress
							class="progress-xs mt-2"
							:precision="1"
							color="info"
							:value="20"
						/>
					</CCol>
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">Pageviews</div>
						<strong>78.706 Views (60%)</strong>
						<CProgress
							class="progress-xs mt-2"
							:precision="1"
							color="warning"
							:value="60"
						/>
					</CCol>
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">New Users</div>
						<strong>22.123 Users (80%)</strong>
						<CProgress
							class="progress-xs mt-2"
							:precision="1"
							color="danger"
							:value="80"
						/>
					</CCol>
					<CCol md sm="12" class="mb-sm-2 mb-0 d-md-down-none">
						<div class="text-muted">Bounce Rate</div>
						<strong>Average Rate (40.15%)</strong>
						<CProgress
							class="progress-xs mt-2"
							:precision="1"
							:value="40"
						/>
					</CCol>
				</CRow>
			</CCardFooter>
		</CCard>
	</div>
</template>

<script>
import ActiveChart from "./charts/ActiveCases";
import ConfirmedChart from "./charts/ConfirmedCases";
import fs from 'fs'
import path from 'path'
import axios from 'axios'

export default {
	name: "Dashboard",
	components: {
		ActiveChart,
		ConfirmedChart
	},
	data() {
		return {
			selected: "Month",
			chartLabels: [],
			ActiveCases: [],
			ConfirmedCases: [],
			tableItems: [
				{
					avatar: { url: "img/avatars/1.jpg", status: "success" },
					user: {
						name: "Yiorgos Avraamu",
						new: true,
						registered: "Jan 1, 2015"
					},
					country: { name: "USA", flag: "cif-us" },
					usage: { value: 50, period: "Jun 11, 2015 - Jul 10, 2015" },
					payment: { name: "Mastercard", icon: "cib-cc-mastercard" },
					activity: "10 sec ago"
				},
				{
					avatar: { url: "img/avatars/2.jpg", status: "danger" },
					user: {
						name: "Avram Tarasios",
						new: false,
						registered: "Jan 1, 2015"
					},
					country: { name: "Brazil", flag: "cif-br" },
					usage: { value: 22, period: "Jun 11, 2015 - Jul 10, 2015" },
					payment: { name: "Visa", icon: "cib-cc-visa" },
					activity: "5 minutes ago"
				},
				{
					avatar: { url: "img/avatars/3.jpg", status: "warning" },
					user: {
						name: "Quintin Ed",
						new: true,
						registered: "Jan 1, 2015"
					},
					country: { name: "India", flag: "cif-in" },
					usage: { value: 74, period: "Jun 11, 2015 - Jul 10, 2015" },
					payment: { name: "Stripe", icon: "cib-stripe" },
					activity: "1 hour ago"
				},
				{
					avatar: { url: "img/avatars/4.jpg", status: "" },
					user: {
						name: "Enéas Kwadwo",
						new: true,
						registered: "Jan 1, 2015"
					},
					country: { name: "France", flag: "cif-fr" },
					usage: { value: 98, period: "Jun 11, 2015 - Jul 10, 2015" },
					payment: { name: "PayPal", icon: "cib-paypal" },
					activity: "Last month"
				},
				{
					avatar: { url: "img/avatars/5.jpg", status: "success" },
					user: {
						name: "Agapetus Tadeáš",
						new: true,
						registered: "Jan 1, 2015"
					},
					country: { name: "Spain", flag: "cif-es" },
					usage: { value: 22, period: "Jun 11, 2015 - Jul 10, 2015" },
					payment: { name: "Google Wallet", icon: "cib-google-pay" },
					activity: "Last week"
				},
				{
					avatar: { url: "img/avatars/6.jpg", status: "danger" },
					user: {
						name: "Friderik Dávid",
						new: true,
						registered: "Jan 1, 2015"
					},
					country: { name: "Poland", flag: "cif-pl" },
					usage: { value: 43, period: "Jun 11, 2015 - Jul 10, 2015" },
					payment: { name: "Amex", icon: "cib-cc-amex" },
					activity: "Last week"
				}
			],
			tableFields: [
				{ key: "avatar", label: "", _classes: "text-center" },
				{ key: "user" },
				{ key: "country", _classes: "text-center" },
				{ key: "usage" },
				{
					key: "payment",
					label: "Payment method",
					_classes: "text-center"
				},
				{ key: "activity" }
			]
		};
	},
	mounted: function () {
		//this.getLabels();
		this.getActiveCases();
		this.getConfirmedCases();
	},
	methods: {
		getLabels() {
			// get from /getLabels
			axios.get( 'https://auscovid19.herokuapp.com//data/getLabels').then((resp) => {
				this.chartLabels = resp.data
			})
		},
		getActiveCases() {
			let apiURL = ""

			if (typeof process.env.SERVER_URL == "undefined") {
				apiURL = `${window.location.protocol}//${window.location.hostname}/data/getActiveCases`
			} else {
				apiURL = `${process.env.SERVER_URL}data/getActiveCases`
			}
			console.log(apiURL, 'utl')
			axios.get(apiURL).then((resp) => {
				this.ActiveCases = resp.data
			})
		},
		getConfirmedCases() {
			axios.get('https://auscovid19.herokuapp.com/data/getConfirmedCases').then((resp) => {
				this.ConfirmedCases = resp.data
			})
		},
		color(value) {
			let $color;
			if (value <= 25) {
				$color = "info";
			} else if (value > 25 && value <= 50) {
				$color = "success";
			} else if (value > 50 && value <= 75) {
				$color = "warning";
			} else if (value > 75 && value <= 100) {
				$color = "danger";
			}
			return $color;
		}
	}
};
</script>
