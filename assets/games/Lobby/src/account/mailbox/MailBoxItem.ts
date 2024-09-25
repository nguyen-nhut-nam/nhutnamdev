const {ccclass, property} = cc._decorator;

@ccclass
export default class MailBoxItem extends cc.Component {
    @property(cc.Sprite)
    mailBg = null;
    @property(cc.Label)
    mailTitle = null;
    @property(cc.Label)
    mailTime = null;
    @property(cc.SpriteFrame)
    mailBGRead = null;
    @property(cc.SpriteFrame)
    mailBGUnRead = null;

    initMail(mailInformation) {
        this.mailTitle.string = mailInformation.title;
        this.mailTime.string = mailInformation.createTime ? `${mailInformation.createTime.split(" ")[1]} - ${mailInformation.createTime.split(" ")[0]}` : "";
        this.mailBg.spriteFrame = mailInformation.status === 0 ? this.mailBGUnRead : this.mailBGRead;
    }
}
