import { isAny } from 'bpmn-js/lib/util/ModelUtil';
import { getOriginal, toPoint } from 'diagram-js/lib/util/Event';

const HIGH_PRIORITY = 3000;
const TASK_TYPES = [ 'choreography:ChoreographyTask' ];

export default function ChoreographyNameEditing(eventBus, modeling, canvas) {
    eventBus.on('element.dblclick', HIGH_PRIORITY, function(event) {
        const element = event.element;

        if (!isAny(element, TASK_TYPES)) {
            return;
        }

        const position = getDiagramPosition(event, canvas);

        if (!position) {
            return;
        }

        const relativeY = position.y - element.y;
        const height = element.height;
        const topHeight = height / 3;
        const bottomStart = (2 * height) / 3;
        const bottomHeight = height / 3;
        const businessObject = element.businessObject;

        // Edit initiator if the click is in the upper third.
        if (relativeY >= 0 && relativeY < topHeight) {
            const initiator = businessObject?.initiatingParticipantRef;

            if (!initiator) {
                return false;
            }

            const nextName = window.prompt('Initiator-Name', initiator.name || '');

            if (nextName === null) {
                return false;
            }

            modeling.updateModdleProperties(element, initiator, {
                name: nextName.trim()
            });

            return false;
        }

        // Edit responder row if the click is in the lower third.
        if (relativeY >= bottomStart && relativeY <= height) {
            const responders = businessObject?.participantRef || [];

            if (!responders.length) {
                return false;
            }

            const rowHeight = bottomHeight / responders.length;
            const rowIndex = Math.min(
                responders.length - 1,
                Math.floor((relativeY - bottomStart) / rowHeight)
            );
            const responder = responders[rowIndex];

            if (!responder) {
                return false;
            }

            const nextName = window.prompt(`Responder ${rowIndex + 1}-Name`, responder.name || '');

            if (nextName === null) {
                return false;
            }

            modeling.updateModdleProperties(element, responder, {
                name: nextName.trim()
            });

            return false;
        }
    });
}

ChoreographyNameEditing.$inject = [ 'eventBus', 'modeling', 'canvas' ];

function getDiagramPosition(event, canvas) {
    const originalEvent = getOriginal(event);
    const point = originalEvent && toPoint(originalEvent);

    if (!point) {
        return null;
    }

    const viewbox = canvas.viewbox();
    const containerRect = canvas.getContainer().getBoundingClientRect();

    return {
        x: viewbox.x + (point.x - containerRect.left) / viewbox.scale,
        y: viewbox.y + (point.y - containerRect.top) / viewbox.scale
    };
}
