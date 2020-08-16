import { notification } from 'antd';

export default function openNotificationWithIcon (type,title,description) {
    //console.log(type,title,description)
    notification[type]({
        message: title,
        description:description,
      });
}