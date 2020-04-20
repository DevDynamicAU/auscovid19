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
		<CCard>
			<CCardBody>
				<CRow>
					<CCol sm="5">
						<h4 id="traffic" class="card-title mb-0">No. of Deaths (Australia)</h4>
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
				<NbrOfDeathsChart 
					style="height:500px; margin-top:40px;"
					:chartData="NbrOfDeaths"
					:lineWidth=3 />
			</CCardBody>
			<CCardFooter>
				<CRow class="text-center w-25">
					<CCol md sm="12" class="mb-sm-2 mb-0">
						<div class="text-muted">Total</div>
						<strong>{{ totalDeaths }}</strong>
						<CProgress
							class="progress-xs mt-2 d-none"
							:precision="1"
							color="success"
							:value="totalDeaths"
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
import NbrOfDeathsChart from './charts/NbrOfDeaths'

import fs from 'fs'
import path from 'path'
import axios from 'axios'

export default {
	name: "Dashboard",
	components: {
		ActiveChart,
		ConfirmedChart,
		NbrOfDeathsChart
	},
	data() {
		return {
			selected: "Month",
			chartLabels: [],
			ActiveCases: [],
			ConfirmedCases: [],
			NbrOfDeaths: []
		};
	},
	mounted: function () {
		//this.getLabels();
		this.getActiveCases();
		this.getConfirmedCases();
		this.getNbrOfDeaths();
	},
	computed: {
		totalDeaths: function () {
			let result = -1

			if (this.NbrOfDeaths.length > 0) {
				result = this.NbrOfDeaths.filter(v => v.type == "Total")[0].count 
			}

			return result
		}
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

			axios.get(apiURL).then((resp) => {
				this.ActiveCases = resp.data
			})
		},
		getConfirmedCases() {
			let apiURL = ""

			if (typeof process.env.SERVER_URL == "undefined") {
				apiURL = `${window.location.protocol}//${window.location.hostname}/data/getConfirmedCases`
			} else {
				apiURL = `${process.env.SERVER_URL}data/getActiveCases`
			}

			axios.get(apiURL).then((resp) => {
				this.ConfirmedCases = resp.data
			})
		},
		getNbrOfDeaths() {
			let apiURL = ""

			if (typeof process.env.SERVER_URL == "undefined") {
				apiURL = `${window.location.protocol}//${window.location.hostname}/data/getNbrOfDeaths`
			} else {
				apiURL = `${process.env.SERVER_URL}data/getNbrOfDeaths`
			}

			axios.get(apiURL).then((resp) => {
				this.NbrOfDeaths = resp.data
			})
		}
	}
};
</script>
