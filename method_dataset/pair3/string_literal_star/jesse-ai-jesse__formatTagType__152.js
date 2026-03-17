function formatTagType(char, supportCodeSegments) {
    switch (char) {
        case '*':
            return 3 /* FormatType.Bold */;
        case '_':
            return 4 /* FormatType.Italics */;
        case '[':
            return 5 /* FormatType.Action */;
        case ']':
            return 6 /* FormatType.ActionClose */;
        case '`':
            return supportCodeSegments ? 7 /* FormatType.Code */ : 0 /* FormatType.Invalid */;
        default:
            return 0 /* FormatType.Invalid */;
    }
}
