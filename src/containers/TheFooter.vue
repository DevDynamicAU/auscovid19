<template>
	<CFooter :fixed="false">
		<div>
			COVID-19 Australian Charts
			<span class="ml-1">
				&copy; {{ new Date().getFullYear() }}
				<a href="https://devdynamic.com.au" target="_blank">DevDynamic</a>
			</span>
		</div>
		<div class="ml-auto">
			<span class="ml-1">
				&copy; {{ new Date().getFullYear() }}
				<a href="https://devdynamic.com.au" target="_blank">DevDynamic</a>
			</span>
		</div>
	</CFooter>
</template>

<script>
export default {
	name: "TheFooter"
};
</script>
