// Backend Proxy for Impact Slow forest AI
// File: impact-app/pocketbase/pb_hooks/main.pb.js

routerAdd("POST", "/api/custom/ai-chat", (e) => {
    var GEMINI_API_KEY = "AIzaSyDAO5UJShIF9mB9Tu6HmRZYLFVlke1AzTg";
    var GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

    try {
        var body = e.requestInfo().body;
        var contents = body.contents;

        // Forward request to Gemini API
        var res = $http.send({
            method: "POST",
            url: GEMINI_API_URL + GEMINI_API_KEY,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: body.generationConfig || {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            }),
            timeout: 60
        });

        return e.json(res.statusCode, res.json);
    } catch (err) {
        return e.json(500, { error: err.message });
    }
});
