import ChoreographyRenderer from "./ChoreographyRenderer";
import ChoreographyRules from "./ChoreographyRules";
import ChoreographyNameEditing from "./ChoreographyNameEditing";


export default {
    __init__: [
        'choreographyRenderer',
        'choreographyRules',
        'choreographyNameEditing'
    ],
    choreographyRenderer: ['type', ChoreographyRenderer],
    choreographyRules: ['type', ChoreographyRules],
    choreographyNameEditing: ['type', ChoreographyNameEditing]
}
