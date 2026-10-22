import 'react-native-url-polyfill/auto';
import * as signalR from "@microsoft/signalr";
import { DeviceEventEmitter } from 'react-native';

class SignalRService {
    constructor() {
        this.connection = null;
        this.heartbeatInterval = null;
        this.isConnecting = false;
    }

    // CONNECT
    async startConnection(userId) {
        if (this.isConnecting) return;
        this.isConnecting = true;

        try {
            // 🛑 1. FORCE STOP OLD CONNECTION (Prevents Duplicates)
            if (this.connection) {
                console.log("♻️ Stopping existing connection...");
                try {
                    await this.connection.stop();
                } catch (e) {
                    console.log("⚠️ Stop warning:", e);
                }
                this.connection = null; // Clear reference
            }

            console.log("🔌 Initializing New SignalR Connection...");

            // 🔍 DIAGNOSTIC: Check Internet First
            try {
                console.log("🌐 Checking Internet...");
                await fetch('https://www.google.com', { method: 'HEAD' });
                console.log("✅ Internet is ONLINE (Google reachable)");
            } catch (netErr) {
                console.error("❌ Internet Check FAILED: Device might be offline", netErr);
                // We proceed anyway, but log gives hint
            }

            // 🔄 STRATEGY: Try Standard First, Then Fallback to LongPolling
            try {
                // 🚀 Attempt 1: Standard (WebSockets prioritized)
                this.connection = new signalR.HubConnectionBuilder()
                    .withUrl(`https://lavachat.xyz/chatHub?userId=${userId}`, {
                        headers: { "User-Agent": "Lavachat-Android-App" } // Fixes some WAF blocks
                    })
                    .withAutomaticReconnect()
                    .configureLogging(signalR.LogLevel.Information)
                    .build();

                this._registerListeners(this.connection);
                await this.connection.start();
                console.log("🔥 SignalR Connected (Standard)!");
                return true;

            } catch (stdError) {
                console.warn("⚠️ Standard Connect Failed. Switching to Compatibility Mode...", stdError);

                // 🐢 Attempt 2: LongPolling (For Android 10 / Strict Firewalls / SSL Issues)
                try {
                    this.connection = new signalR.HubConnectionBuilder()
                        .withUrl(`https://lavachat.xyz/chatHub?userId=${userId}`, {
                            transport: signalR.HttpTransportType.LongPolling,
                            headers: { "User-Agent": "Lavachat-Android-App" }
                        })
                        .withAutomaticReconnect()
                        .configureLogging(signalR.LogLevel.Information)
                        .build();

                    this._registerListeners(this.connection);
                    await this.connection.start();
                    console.log("🔥 SignalR Connected (Compatibility Mode)!");
                    return true;
                } catch (fallbackError) {
                    console.error("❌ Ultimate Failure:", fallbackError);
                    return fallbackError;
                }
            }
        } catch (error) {
            console.error("❌ Critical SignalR Error:", error);
            return error;
        } finally {
            this.isConnecting = false;
        }
    }

    // Helper to keep code clean
    _registerListeners(conn) {
        conn.on("ReceiveMessage", (userObj, msgText) => {
            console.log("⚡ SignalR Received:", msgText);
            DeviceEventEmitter.emit('onSignalRMessage', {
                userId: userObj?.userId,
                username: userObj?.username || "Unknown",
                text: msgText
            });
        });
    }


    // JOIN ROOM DIRECTLY (Fallback if API doesn't sync)
    async joinRoomHub(roomId) {
        if (!this.isConnected()) return;
        try {
            console.log("Trying Hub.JoinRoom...");
            await this.connection.invoke("JoinRoom", Number(roomId));
            console.log("✅ Hub.JoinRoom Success!");
        } catch (e) {
            console.log("⚠️ Hub.JoinRoom Failed (Method might not exist):", e);
            // Try explicit group add?
            try {
                await this.connection.invoke("JoinGroup", String(roomId));
                console.log("✅ Hub.JoinGroup Success!");
            } catch (e2) {
                console.log("⚠️ Hub.JoinGroup Failed:", e2);
            }
        }
    }

    // SEND
    async sendMessage(userId, text) {
        if (!this.isConnected()) {
            console.log("❌ Not connected");
            return false;
        }
        try {
            await this.connection.invoke(
                "SendMessageByUserId",
                Number(userId),
                text
            );
            return true;
        } catch (err) {
            console.log("SendMessage ERROR:", err);
            return false;
        }
    }

    getConnectionId() {
        return this.connection ? this.connection.connectionId : null;
    }

    isConnected() {
        return this.connection && this.connection.state === signalR.HubConnectionState.Connected;
    }

    async stopConnection() {
        if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
        if (this.connection) {
            await this.connection.stop();
        }
    }

    // Legacy stub to prevent crashes if called
    onMessageReceived(callback) {
        console.warn("Use DeviceEventEmitter instead of onMessageReceived");
    }
}

export default new SignalRService();
