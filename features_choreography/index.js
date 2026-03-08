import ChoreographyRenderer from "./ChoreographyRenderer";
import ChoreographyRules from "./ChoreographyRules";
import ChoreographyNameEditing from "./ChoreographyNameEditing";
import ChoreographyContexPad from "./ChoreographyContextPad";


export default {
    __init__: [
        'choreographyRenderer',
        'choreographyRules',
        'choreographyNameEditing',
        'choreographyContextPad'
    ],
    choreographyRenderer: ['type', ChoreographyRenderer],
    choreographyRules: ['type', ChoreographyRules],
    choreographyNameEditing: ['type', ChoreographyNameEditing],
    choreographyContextPad: ['type', ChoreographyContexPad]
}
