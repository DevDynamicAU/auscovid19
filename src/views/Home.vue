<template>
	<c-container fluid>
		<c-row alignHorizontal="center">
			<router-link v-for="itm of countries" :key="itm.name" :to="itm.to" class="w-25 mr-2">
				<c-card>
					<c-card-body>
						<c-icon :name="itm.icon" custom-classes="w-100 mh-180"></c-icon>
					</c-card-body>
					<c-card-footer align="center">
						{{ itm.name }}
					</c-card-footer>
				</c-card>
			</router-link>
		</c-row>
	</c-container>
</template>

<script>
	import nav from '../containers/_nav'

	export default {
		data() {
			return {
				name: "Home",
				countries: []
			};
		},
		mounted: function() {
			this.countries = nav[0]._children.filter(x => x.to != "/")
		},
		computed: { },
		methods: { },
	};
</script>
