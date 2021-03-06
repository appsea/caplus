import { QuestionUtil } from "~/services/question.util";
import { IOption, IQuestion } from "~/shared/questions.model";
import * as TKUnit from "../TKUnit";

describe("Question Util ", () => {
    it("count Correct Options", () => {
        const iq: IQuestion = { description: "test" } as any as IQuestion;
        const option1: IOption = { tag: "A", description: "A. test",  correct: true} as any as IOption;
        const option2: IOption = { tag: "B", description: "B. test",  correct: false} as any as IOption;
        const option3: IOption = { tag: "C", description: "C. test",  correct: true} as any as IOption;
        const option4: IOption = { tag: "D", description: "D. test",  correct: false} as any as IOption;
        const option5: IOption = { tag: "E", description: "E. test",  correct: false} as any as IOption;
        const options: Array<IOption> = [option1, option2, option3, option4, option5] ;
        iq.options = options;
        const actualCorrectAnswers = QuestionUtil.countCorrectOptions(iq);
        TKUnit.assert(actualCorrectAnswers === 2, "Correct option is 3 but actual is "  + actualCorrectAnswers);
    });
});

describe("Question Util Percentage", () => {
    it("Expected percentage when number greater than 100", () => {
        const actualCorrectAnswers = QuestionUtil.validatePercentage(110);
        TKUnit.assert(actualCorrectAnswers === 100, "Expected percentage as 100 but was "  + actualCorrectAnswers);
    });
});

describe("Question Util Percentage 90", () => {
    it("Expected percentage when number greater than 90", () => {
        const actualCorrectAnswers = QuestionUtil.validatePercentage(90);
        TKUnit.assert(actualCorrectAnswers === 90, "Expected percentage as 90 but was "  + actualCorrectAnswers);
    });
});
