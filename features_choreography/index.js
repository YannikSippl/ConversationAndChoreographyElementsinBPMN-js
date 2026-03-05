import ChoreographyRenderer from "./ChoreographyRenderer";
import ChoreographyRules from "./ChoreographyRules";


export default {
    __init__: [
        'choreographyRenderer',
        'choreographyRules'
    ],
    choreographyRenderer: ['type', ChoreographyRenderer],
    choreographyRules: ['type', ChoreographyRules]
}
