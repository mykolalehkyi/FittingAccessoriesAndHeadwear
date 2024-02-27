import Stats from "../../../../libs/three.js-r132/examples/jsm/libs/stats.module.js";
export class StatsHelper {
    addStatsFPS() {
        this.statsFPS = Stats();
        this.statsFPS.domElement.style.position = 'absolute';
        this.statsFPS.domElement.style.top = '0px';
        document.body.appendChild(this.statsFPS.dom);
        return this.statsFPS;
    }
    addStatsMS() {
        this.statsMS = Stats();
        this.statsMS.showPanel(1);
        this.statsMS.domElement.style.position = 'absolute';
        this.statsMS.domElement.style.top = '50px';
        document.body.appendChild(this.statsMS.dom);
        return this.statsMS;
    }
    addStatsMB() {
        this.statsMB = Stats();
        this.statsMB.showPanel(2);
        this.statsMB.domElement.style.position = 'absolute';
        this.statsMB.domElement.style.top = '100px';
        document.body.appendChild(this.statsMB.dom);
        return this.statsMB;
    }
    getStatsFPS() {
        return this.statsFPS;
    }
    getStatsMS() {
        return this.statsMS;
    }
    getStatsMB() {
        return this.statsMB;
    }
}
//# sourceMappingURL=stats-helper.js.map