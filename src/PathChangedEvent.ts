export default class GradPathChangedEvent extends Event {
    public readonly gradPath: string;
    public readonly gradDisplayName: string;

    constructor(path: string, displayName: string, eventInitDict?: EventInit) {
        super('gradpathchanged', { ...eventInitDict, cancelable: true });
        this.gradPath = path;
        this.gradDisplayName = displayName;
    }
}
