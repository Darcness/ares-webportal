import Component from '@glimmer/component';

export default class Wod5eSheet extends Component {

    parse = (data) => JSON.stringify(data);

    get info() { return Object.entries(this.args.sheet.info).map((k) => ({ name: k[0], value: k[1] })); D }

    get attributes() { return this.column_format(this.args.sheet.attribs, 3, (k, v) => ({ name: k, value: v.value, max: v.max })); }

    get skills() { return this.column_format(this.args.sheet.skills, 3, (k, v) => ({ name: k, value: v.value, max: v.max, specialties: v.specialties })); }

    get advantages() {
        let advantages = [];

        Object.values(this.args.sheet.advantages).forEach((a) => advantages = advantages.concat([
            this.formatAdvantage(a),
            ...Object.values(a.children).map((c) => this.formatAdvantage(c, true))
        ]));

        return this.column_format_with_children(advantages);
    }

    formatAdvantage = (advantage, isChild) => ({
        name: `${isChild ? '&nbsp;&nbsp;-' : ''}${advantage.name}`,
        value: `${advantage.value}${advantage.secondary_value != 0 ? ` (${advantage.secondary_value})` : ''}`
    })

    get edges() {
        let edges = []

        Object.entries(this.args.sheet.edges).forEach((e) => edges = edges.concat([{ name: e[0] }, ...e[1].map((p) => ({ name: `&nbsp;&nbsp;-${p}` }))]));

        edges = edges.map((e) => ({ ...e, value: '' }))
        return this.column_format_with_children(edges);
    }

    get trackers() {
        return Object.entries(this.args.sheet.trackers).map((value) => ({ ...value[1], name: value[0] }));
    }


    get trackerBoxes() {
        return Object.entries(this.args.sheet.trackers).map((value) => {
            let name = value[0];
            let tracker = value[1];

            let trackerBox = Array(tracker.max).fill(0)
                .map((_, i) => `[${tracker.agg > i ? 'X' : (tracker.agg + tracker.superficial) > i ? '/' : ' '}]`)
                .join('');

            return `${name}: ${trackerBox}`
        })
    }

    column_format_with_children = (items) => {
        let midpoint = Math.floor(items.length / 2) + (items.length % 2)

        // We want to keep sub-objects in the same column as their parent.
        // If the first item in the second column is a sub-object (starts with a space),
        // push forward until we find a main-line item.

        while (midpoint > 0 && midpoint < items.length && items[midpoint].name.startsWith('&nbsp;')) {
            midpoint++;
        }

        let values = []

        for (let row = 0; row < midpoint; row++) {
            values.push(items[row]);
            values.push(items[row + midpoint] ?? '');
        }

        return values;
    }

    column_format = (items, columnCount, format) => {
        let val = []

        Object.entries(items).forEach((pair, i, entries) => {
            let size = Math.floor(entries.length / columnCount);
            let pos = (i % size) * columnCount + Math.floor(i / size)
            val[pos] = format(pair[0], pair[1]);
        })

        return val;
    }
}