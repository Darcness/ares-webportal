import Component from '@ember/component';

export default class WoD5eSheet extends Component {

    shouldShow = (data) => !!data;

    parse = (data) => JSON.parse(data);

    getType = (data) => JSON.parse(data).type;

    getPowerHeader = (data) => JSON.parse(data).powers_title;

    formatAttribs = (data) => this.column_format(this.parse(data).attribs, 3, (k, v) => ({ name: k, value: v }))

    formatSkills = (data) => this.column_format(this.parse(data).skills, 3, (k, v) => ({ name: k, value: v.value, specialties: v.specialties }))

    formatAdvantages = (data) => Object.values(this.parse(data).advantages).map((obj) => ({
        ...obj,
        format_value: obj.value + obj.secondary_value ? ` ${obj.secondary_value}` : '',
        children: Object.values(obj.children).map((inner) => ({ ...inner, name: `  -${inner.name}` }))
    }))

    formatEdges = (data) => {
        let sheet = this.parse(data);
        let edges = []

        Object.entries(sheet.edges).forEach((e) => edges = edges.concat([e[0], ...e[1].map((p) => `&nbsp;&nbsp;-${p}`)]));

        let midpoint = Math.floor(edges.length / 2) + (edges.length % 2)

        // We want to keep sub-objects in the same column as their parent.
        // If the first item in the second column is a sub-object (starts with a space),
        // push forward until we find a main-line item.

        while (midpoint > 0 && midpoint < edges.length && edges[midpoint].startsWith('&nbsp;')) {
            midpoint++;
        }

        let values = []

        for (let row = 0; row < midpoint; row++) {
            values.push(edges[row]);
            values.push(edges[row + midpoint] ?? '');
        }

        return values;
    }

    column_format = (items, columnCount, format) => {
        let val = []

        Object.entries(items).forEach((pair, i) => {
            let size = Math.floor(Object.keys(items).length / columnCount);
            let pos = (i % size) * size + Math.floor(i / size)
            val[pos] = format(pair[0], pair[1]);
        })

        return val;
    }
}