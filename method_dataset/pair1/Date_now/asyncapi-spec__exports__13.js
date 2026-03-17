function __method_wrapper__() {
module.exports = async (link, title) => {

    let newCampaign;

    mailchimp.setConfig({
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: 'us12'
    });

    /*
    * First we create campaign
    */
    try {
        newCampaign = await mailchimp.campaigns.create({
            type: 'regular',
            recipients: {
                list_id: '6e3e437abe',
                segment_opts: {
                    match: 'any',
                    conditions: [{
                        condition_type: 'Interests',
                        field: 'interests-2801e38b9f',
                        op: 'interestcontains',
                        value: ['f7204f9b90']
                    }]
                }
            },
            settings: {
                subject_line: `TSC attention required: ${ title }`,
                preview_text: 'Check out the latest topic that TSC members have to be aware of',
                title: `New topic info - ${ new Date(Date.now()).toUTCString()}`,
                from_name: 'AsyncAPI Initiative',
                reply_to: 'info@asyncapi.io',
            }
        });
    } catch (error) {
        return core.setFailed(`Failed creating campaign: ${ JSON.stringify(error) }`);
    }

    /*
    * Content of the email is added separately after campaign creation
    */
    try {
        await mailchimp.campaigns.setContent(newCampaign.id, { html: htmlContent(link, title) });
    } catch (error) {
        return core.setFailed(`Failed adding content to campaign: ${ JSON.stringify(error) }`);
    }

    /*
    * We schedule an email to send it immediately
    */
    try {
        //schedule for next hour
        //so if this code was created by new issue creation at 9:46, the email is scheduled for 10:00
        //is it like this as schedule has limitiations and you cannot schedule email for 9:48
        const scheduleDate = new Date(Date.parse(new Date(Date.now()).toISOString()) + 1 * 1 * 60 * 60 * 1000);
        scheduleDate.setUTCMinutes(00);

        await mailchimp.campaigns.schedule(newCampaign.id, {
            schedule_time: scheduleDate.toISOString(),
        });
    } catch (error) {
        return core.setFailed(`Failed scheduling email: ${ JSON.stringify(error) }`);
    }

    core.info(`New email campaign created`);
}
}
