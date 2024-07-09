import { useEffect, useState } from "react";

interface prop {
    notifications: {
        name: string
    }[]
}


export default function NotificationSlider({ notifications }: prop) {
    const [index, setIndex] = useState(0);
    const notificationCount = notifications.length > 1 ? `${index + 1}/${notifications.length}` : '';

    useEffect(() => {
        setTimeout(() => {
            if (index < notifications.length - 1)
                setIndex(index + 1);
            else
                setIndex(0)
        }, 2500)
    }, [index, notifications.length])

    if (notifications.length === 0)
        return <p>No notification</p>;

    if (notifications.length === 1)
        return <p>Notification: {notifications[0].name}</p>;

    return (
        <p>Notification {notificationCount} {notifications[index].name}</p>
    )

}