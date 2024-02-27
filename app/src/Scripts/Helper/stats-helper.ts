import Stats from "../../../../libs/three.js-r132/examples/jsm/libs/stats.module.js";

export class StatsHelper{
	private statsFPS:Stats;
	private statsMS:Stats;
	private statsMB:Stats;

	public addStatsFPS() {
		this.statsFPS = Stats();
		this.statsFPS.domElement.style.position = 'absolute';
        this.statsFPS.domElement.style.top = '0px';
		document.body.appendChild(this.statsFPS.dom);
		return this.statsFPS;
	}

	public addStatsMS() {
		this.statsMS = Stats();
		this.statsMS.showPanel(1);
		this.statsMS.domElement.style.position = 'absolute';
        this.statsMS.domElement.style.top = '50px';
		document.body.appendChild(this.statsMS.dom);
		return this.statsMS;
	}

	public addStatsMB() {
		this.statsMB = Stats();
		this.statsMB.showPanel(2);
		this.statsMB.domElement.style.position = 'absolute';
        this.statsMB.domElement.style.top = '100px';
		document.body.appendChild(this.statsMB.dom);
		return this.statsMB;
	}

	public getStatsFPS(){
		return this.statsFPS;
	}

	public getStatsMS(){
		return this.statsMS;
	}

	public getStatsMB(){
		return this.statsMB;
	}
}