const propertie = PropertiesService.getScriptProperties().getProperties();
const GOOGLE_CALENDER_ID = propertie.GOOGLE_CALENDER_ID;
const SLACK_OAUTH_TOKEN = propertie.SLACK_OAUTH_TOKEN;
const SLACK_CHANNEL = propertie.SLACK_CHANNEL;

function getDailyEvent() {
    const today = new Date();
    const dailyEvents = CalendarApp.getCalendarById(GOOGLE_CALENDER_ID).getEventsForDay(today);

    callDailyFunction();

    function callDailyFunction() {
        let message = "";
        if (dailyEvents.length == 0) {
            message = ":calendar: 本日のイベント登録は、ありません :calendar:";
        } else {
            message = `:calendar: 本日のイベント登録は、${dailyEvents.length} 件です :calendar:`;
        }

        const attachments = makeAttachmentsMessageForWeekly(dailyEvents);
        postMessageToSlack(message, attachments);
    }

    function makeAttachmentsMessageForWeekly(dailyEvents) {
        return dailyEvents.map(function (event, index) {
            if (dailyEvents[index].isAllDayEvent()) {
                const title = event.getTitle();
                let startAllDay = dailyEvents[index].getAllDayStartDate();
                let endAllDay = dailyEvents[index].getAllDayEndDate();
                startAllDay = Utilities.formatDate(startAllDay, "JST", "yyyy/MM/dd");
                endAllDay = Utilities.formatDate(endAllDay, "JST", "yyyy/MM/dd");
                const text = startAllDay + ' 〜 ' + endAllDay;

                return new attachmentBody(title, text)
            } else {
                const title = event.getTitle();
                let startTime = dailyEvents[index].getStartTime();
                let endTime = dailyEvents[index].getEndTime();
                startTime = Utilities.formatDate(startTime, "JST", "yyyy/MM/dd HH:mm");
                endTime = Utilities.formatDate(endTime, "JST", "yyyy/MM/dd HH:mm");
                const text = startTime + ' 〜 ' + endTime;

                return new attachmentBody(title, text)
            }
        })
    }
}

function getWeeklyEvent() {
    const now = new Date();
    const end = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1週間後
    const weeklyEvents = CalendarApp.getCalendarById(GOOGLE_CALENDER_ID).getEvents(now, end);

    callWeeklyFunction();

    function callWeeklyFunction() {
        let message = "";
        if (weeklyEvents.length == 0) {
            message = ":spiral_calendar_pad: 今週のイベント登録は、ありません :spiral_calendar_pad: ";
        } else {
            message = `:spiral_calendar_pad: 今週のイベント登録は、${weeklyEvents.length} 件です :spiral_calendar_pad:`;
        }

        const attachments = makeAttachmentsMessageForWeekly(weeklyEvents);
        postMessageToSlack(message, attachments);
    }

    function makeAttachmentsMessageForWeekly(weeklyEvents) {
        return weeklyEvents.map(function (event, index) {
            if (weeklyEvents[index].isAllDayEvent()) {
                const title = event.getTitle();
                let startAllDay = weeklyEvents[index].getAllDayStartDate();
                let endAllDay = weeklyEvents[index].getAllDayEndDate();
                startAllDay = Utilities.formatDate(startAllDay, "JST", "yyyy/MM/dd");
                endAllDay = Utilities.formatDate(endAllDay, "JST", "yyyy/MM/dd");
                const text = startAllDay + ' 〜 ' + endAllDay;

                return new attachmentBody(title, text)
            } else {
                const title = event.getTitle();
                let startTime = weeklyEvents[index].getStartTime();
                let endTime = weeklyEvents[index].getEndTime();
                startTime = Utilities.formatDate(startTime, "JST", "yyyy/MM/dd HH:mm");
                endTime = Utilities.formatDate(endTime, "JST", "yyyy/MM/dd HH:mm");
                const text = startTime + ' 〜 ' + endTime;

                return new attachmentBody(title, text)
            }
        })
    }
}

class attachmentBody {
    constructor(title, text) {
        this.title = title
        this.text = text
        this.color = "#36a64f"
    }
}

function postMessageToSlack(message, attachments) {
    const payload = {
        "token": SLACK_OAUTH_TOKEN,
        "channel": SLACK_CHANNEL,
        "text": message,
        "attachments": JSON.stringify(attachments)
    };

    const params = {
        "method": "POST",
        "payload": payload
    }

    const postUrl = "https://slack.com/api/chat.postMessage";
    UrlFetchApp.fetch(postUrl, params)
}
