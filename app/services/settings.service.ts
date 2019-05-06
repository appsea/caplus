import * as appSettings from "tns-core-modules/application-settings";
import { ISetting, IState } from "~/shared/questions.model";
import * as constantsModule from "../shared/constants";
import * as navigationModule from "../shared/navigation";

export class SettingsService {

    static getInstance(): SettingsService {
        return SettingsService._instance;
    }

    static route(): boolean {
        const path = SettingsService.getInstance().getRoute();
        if (!path.includes(constantsModule.PRACTICE)) {
            navigationModule.toPage(path);

            return true;
        }

        return false;
    }

    private static _instance: SettingsService = new SettingsService();

    private setting: ISetting;

    constructor() {
        this.handleStructureChange();
        this.clearAll();
        this.createSetting();
    }

    createSetting(): void {
        if (appSettings.hasKey(constantsModule.SETTINGS)) {
            this.setting = this.readSettings();
        } else {
            this.setting = this.getDefaultSetting();
            appSettings.setString(constantsModule.SETTINGS, JSON.stringify(this.setting));
        }
        if (!appSettings.hasKey(constantsModule.QUICK)) {
            this.saveCache(constantsModule.QUICK, this.getDefaultQuick());
        }
        if (!appSettings.hasKey(constantsModule.MOCK)) {
            this.saveCache(constantsModule.MOCK, this.getDefaultMock());
        }
    }

    readSettings(): ISetting {
        let setting: ISetting;
        try {
            setting = appSettings.hasKey(constantsModule.SETTINGS)
                ? JSON.parse(appSettings.getString(constantsModule.SETTINGS))
                : this.getDefaultSetting();
        } catch (error) {
            setting = this.getDefaultSetting();
        }

        return setting;
    }

    readCache(mode: string): IState {
        let state: IState;
        if (appSettings.hasKey(mode)) {
            state = JSON.parse(appSettings.getString(mode));
        } else if (mode === constantsModule.QUICK) {
            state = this.getDefaultQuick();
        } else if (mode === constantsModule.MOCK) {
            state = this.getDefaultMock();
        } else {
            state = this.getDefaultQuick();
        }

        return state;
    }

    saveCache(mode: string, state: IState): void {
        const newState: string = JSON.stringify(state);
        appSettings.setString(mode, newState);
    }

    clearCache(mode: string): void {
        appSettings.remove(mode);
    }

    clearAll(): void {
        this.clearCache(constantsModule.MAIN);
        this.clearCache(constantsModule.QUICK1);
        this.clearCache(constantsModule.TICK);
        if (constantsModule.CLEAR
            || !appSettings.hasKey(constantsModule.VERSION)
            || appSettings.getNumber(constantsModule.VERSION) < constantsModule.VERSION_NUMBER) {
            this.oneTimeCleanup();
        }
        this.clearCache(constantsModule.PRACTICE);
        appSettings.setNumber(constantsModule.VERSION, constantsModule.VERSION_NUMBER);
    }

    saveSetting(setting: ISetting) {
        const newSetting: string = JSON.stringify(setting);
        appSettings.setString(constantsModule.SETTINGS, newSetting);
    }

    saveRoute(path: string): void {
        appSettings.setString(constantsModule.ROUTE, path);
    }

    getRoute(): string {
        if (appSettings.hasKey(constantsModule.ROUTE)) {
            return appSettings.getString(constantsModule.ROUTE);
        }

        return "question/practice-page";
    }

    private oneTimeCleanup() {
        this.cleanUpState("practice");
        this.cleanUpState("quick");
        this.cleanUpState("mock");
    }

    private cleanUpState(mode: string) {
        if (appSettings.hasKey(mode)) {
            const state: IState = JSON.parse(appSettings.getString(mode));
            state.mode = mode + "-page";
            appSettings.setString(state.mode, JSON.stringify(state));
        }
    }

    private getDefaultQuick() {
        return {
            questions: [],
            questionNumber: 0,
            totalQuestions: this.readSettings().totalQuestionsQuick
        };
    }

    private getDefaultMock() {
        return {
            questions: [],
            questionNumber: 0,
            totalQuestions: this.readSettings().totalQuestionsMock,
            time: this.readSettings().totalTime
        };
    }

    private handleStructureChange() {
        if (appSettings.hasKey(constantsModule.SETTINGS)
            && !appSettings.hasKey(constantsModule.ADDTICK)) {
            const setting: ISetting = JSON.parse(appSettings.getString(constantsModule.SETTINGS));
            setting.totalTime = this.getDefaultSetting().totalTime;
            appSettings.setString(constantsModule.SETTINGS, JSON.stringify(setting));
            appSettings.setBoolean(constantsModule.ADDTICK, true);
        }
    }

    private getDefaultSetting() {
        return {
            totalQuestionsQuick: 15,
            totalTime: 110,
            totalQuestionsMock: 67
        };
    }
}
