import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { POST_TYPES } from "./redux/actions/postAction";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import { NOTIFY_TYPES } from "./redux/actions/notifyAction";
import audiobell from "./audio/notify_sound.mp3";
import { MESS_TYPES } from "./redux/actions/messageAction";

const spawnNotification = (body, icon, url, title) => {
    let options = {
        body,
        icon,
    };
    let n = new Notification(title, options);

    n.onclick = (e) => {
        e.preventDefault();
        window.open(url, "_blank");
    };
};

const SocketClient = () => {
    const { auth, socket, notify, online } = useSelector((state) => state);
    const dispatch = useDispatch();

    const audioRef = useRef();

    // joinUser
    useEffect(() => {
        socket.emit("joinUser", auth.user);
        console.log("Added user");
    }, [socket, auth.user]);

    // Likes
    useEffect(() => {
        socket.on("likeToClient", (newPost) => {
            //console.log("Like client")
            //console.log(newPost)
            dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
        });

        return () => socket.off("likeToClient");
    }, [socket, dispatch]);

    // unLikes
    useEffect(() => {
        socket.on("unLikeToClient", (newPost) => {
            //console.log("unLike client")
            //console.log(newPost)
            dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
        });

        return () => socket.off("unLikeToClient");
    }, [socket, dispatch]);

    //create comment
    useEffect(() => {
        socket.on("createCommentToClient", (newPost) => {
            dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
        });

        return () => socket.off("createCommentToClient");
    }, [socket, dispatch]);

    //delete comment
    useEffect(() => {
        socket.on("deleteCommentToClient", (newPost) => {
            dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost });
        });

        return () => socket.off("deleteCommentToClient");
    }, [socket, dispatch]);

    // Follow
    useEffect(() => {
        socket.on("followToClient", (newUser) => {
            dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
        });

        return () => socket.off("followToClient");
    }, [socket, dispatch, auth]);

    // Unfollow
    useEffect(() => {
        socket.on("unFollowToClient", (newUser) => {
            dispatch({ type: GLOBALTYPES.AUTH, payload: { ...auth, user: newUser } });
        });

        return () => socket.off("unFollowToClient");
    }, [socket, dispatch, auth]);

    //Notify
    useEffect(() => {
        socket.on("createNotifyToClient", (msg) => {
            dispatch({ type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg });
            if (notify.sound) audioRef.current.play();
            spawnNotification(
                msg.user.username + " " + msg.text,
                msg.user.avatar,
                msg.url,
                "Instagram"
            );
        });

        return () => socket.off("createNotifyToClient");
    }, [socket, dispatch, auth, notify.sound]);

    useEffect(() => {
        socket.on("removeNotifyToClient", (msg) => {
            dispatch({ type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg });
        });

        return () => socket.off("removeNotifyToClient");
    }, [socket, dispatch, auth]);

    //Message
    useEffect(() => {
        socket.on("addMessageToClient", (msg) => {
            dispatch({
                type: MESS_TYPES.ADD_MESSAGE,
                payload: msg,
            });

            // console.log(msg);
            dispatch({
                type: MESS_TYPES.ADD_USER,
                payload: { ...msg.user, text: msg.text, media: msg.media },
            });
        });

        return () => socket.off("addMessageToClient");
    }, [socket, dispatch, auth]);

    //check user Online/ offline
    useEffect(() => {
        socket.emit("checkUserOnline", auth.user);
    }, [socket, auth.user]);

    useEffect(() => {
        socket.on("checkUserOnlineToMe", (data) => {
            // console.log(data);
            data.forEach((item) => {
                if (!online.includes(item.id)) {
                    dispatch({ type: GLOBALTYPES.ONLINE, payload: item.id });
                }
            });
        });

        return () => socket.off("checkUserOnlineToMe");
    }, [socket, dispatch, online]);

    useEffect(() => {
        socket.on("checkUserOnlineToClient", (id) => {
            // console.log(data);
            if (!online.includes(id)) {
                dispatch({ type: GLOBALTYPES.ONLINE, payload: id });
            }
        });

        return () => socket.off("checkUserOnlineToClient");
    }, [socket, dispatch, online]);

    //check user offline
    useEffect(() => {
        socket.on("checkUserOffline", (id) => {
            //console.log(id);
            dispatch({ type: GLOBALTYPES.OFFLINE, payload: id });
        });

        return () => socket.off("checkUserOffline");
    }, [socket, dispatch]);

    return (
        <>
            <audio controls ref={audioRef} style={{ display: "none" }}>
                <source src={audiobell} type="audio/mp3" />
            </audio>
        </>
    );
};
export default SocketClient;