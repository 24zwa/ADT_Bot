const propertie = PropertiesService.getScriptProperties().getProperties();
const GOOGLE_CALENDER_ID = propertie.GOOGLE_CALENDER_ID;
const SLACK_OAUTH_TOKEN = propertie.SLACK_OAUTH_TOKEN;
const SLACK_CHANNEL = propertie.SLACK_CHANNEL;

// Slack への通知設定
function notifyToSlack(message) {
    let payload = {
        token: SLACK_OAUTH_TOKEN,
        channel: SLACK_CHANNEL,
        text: message,
    };
    let params = {
        method: "post",
        payload: payload,
    };
    const postUrl = "https://slack.com/api/chat.postMessage";
    UrlFetchApp.fetch(postUrl, params);
}

// [日次] 勤怠登録を ADT チャンネルに通知
function getDailyEvent() {
    const today = new Date();
    const dailyEvents = CalendarApp.getCalendarById(GOOGLE_CALENDER_ID).getEventsForDay(today);

    const notifyDailyMessage = ':calendar: 本日の勤怠登録をお知らせします :calendar:';
    notifyToSlack(notifyDailyMessage);

    if (dailyEvents.length == 0) {
        const noEventsInDay = '本日の勤怠登録は、ありません';
        notifyToSlack(noEventsInDay);
        return;
    }

    for (let i in dailyEvents) {
        let title = dailyEvents[i].getTitle();

        if (dailyEvents[i].isAllDayEvent()) {
            let startAllDay = dailyEvents[i].getAllDayStartDate();
            let endAllDay = dailyEvents[i].getAllDayEndDate();
            startAllDay = Utilities.formatDate(startAllDay, "JST", "yyyy/MM/dd");
            endAllDay = Utilities.formatDate(endAllDay, "JST", "yyyy/MM/dd");
            let postAllDayMessage = '・' + title + '  期間: ' + startAllDay + ' 〜 ' + endAllDay;
            notifyToSlack(postAllDayMessage);
        } else {
            let startTime = dailyEvents[i].getStartTime();
            let endTime = dailyEvents[i].getEndTime();
            startTime = Utilities.formatDate(startTime, "JST", "yyyy/MM/dd HH:mm");
            endTime = Utilities.formatDate(endTime, "JST", "yyyy/MM/dd HH:mm");
            let postMessage = '・' + title + '  期間: ' + startTime + ' 〜 ' + endTime;
            notifyToSlack(postMessage);
        }
    }
}

// [週次] 勤怠登録を ADT チャンネルに通知
function getWeeklyEvent() {
    const now = new Date();
    const end = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 1週間後
    const weeklyEvents = CalendarApp.getCalendarById(GOOGLE_CALENDER_ID).getEvents(now, end);

    const notifyWeeklyMessage = ':calendar: 今週の勤怠登録をお知らせします :calendar:';
    notifyToSlack(notifyWeeklyMessage);

    if (weeklyEvents.length == 0) {
        const noEventsInWeek = '今週の勤怠登録は、現時点でありません';
        notifyToSlack(noEventsInWeek);
        return;
    }

    for (let i in weeklyEvents) {
        let title = weeklyEvents[i].getTitle();

        if (weeklyEvents[i].isAllDayEvent()) {
            let startAllDay = weeklyEvents[i].getAllDayStartDate();
            let endAllDay = weeklyEvents[i].getAllDayEndDate();
            startAllDay = Utilities.formatDate(startAllDay, "JST", "yyyy/MM/dd");
            endAllDay = Utilities.formatDate(endAllDay, "JST", "yyyy/MM/dd");
            let postAllDayMessage = '・' + title + '  期間: ' + startAllDay + ' 〜 ' + endAllDay;
            notifyToSlack(postAllDayMessage);
        } else {
            let startTime = weeklyEvents[i].getStartTime();
            let endTime = weeklyEvents[i].getEndTime();
            startTime = Utilities.formatDate(startTime, "JST", "yyyy/MM/dd HH:mm");
            endTime = Utilities.formatDate(endTime, "JST", "yyyy/MM/dd HH:mm");
            let postMessage = '・' + title + '  期間: ' + startTime + ' 〜 ' + endTime;
            notifyToSlack(postMessage);
        }
    }
}
