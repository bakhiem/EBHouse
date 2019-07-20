export class CommmonFunction{
    public static escapeSpecialChars(jsonString) {
        return jsonString.replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f");

    }
}