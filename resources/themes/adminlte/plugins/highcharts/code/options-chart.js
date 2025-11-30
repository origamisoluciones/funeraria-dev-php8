'use strict';
//import Highcharts from '../parts/Globals.js';
/* global document */
// Load the fonts
/*Highcharts.createElement('link', {
	href: 'https://fonts.googleapis.com/css?family=Dosis:400,600',
	rel: 'stylesheet',
	type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);*/

Highcharts.theme = {
	colors: ['#333', '#212331', '#002490', '#002490'],
	chart: {
		backgroundColor: null,
		style: {
			fontFamily: 'Arial, Helvetica, sans-serif'
		}
	},
	title: {
		style: {
			fontSize: '16px',
			fontWeight: 'bold',
			textTransform: 'uppercase',
            color: '#667388'
		}
	},
	tooltip: {
		borderWidth: 0,
		backgroundColor: 'rgba(197,197,201,0.8)',
		shadow: false
	},
	legend: {
		itemStyle: {
			fontWeight: 'bold',
			fontSize: '14px'
		}
	},
	xAxis: {
		gridLineWidth: 1,
		labels: {
			style: {
				fontSize: '12px'
			}
		}
	},
	yAxis: {
		minorTickInterval: 'auto',
		title: {
			style: {
				textTransform: 'uppercase'
			}
		},
		labels: {
			style: {
				fontSize: '12px'
			}
		}
	},
	plotOptions: {
		candlestick: {
			lineColor: '#404048'
		}
	}
};
Highcharts.setOptions(Highcharts.theme);

//Opciones de idioma
Highcharts.setOptions({
    lang: {
        contextButtonTitle: "Opciones",
        downloadJPEG: "Descargar como imagen JPEG",
        downloadPDF: "Descargar en formato PDF",
        downloadPNG: "Descargar como imagen PNG",
        downloadSVG: "Descargar en formato vectorial",
        drillUpText: "Volver a {series.name}",
        loading: "Cargando...",
        printChart: "Imprimir gráfico",
        resetZoom: "Ajustar zoom por defecto",
        resetZoomTitle: "Ajustar zoom a escala 1:1"
    }
});