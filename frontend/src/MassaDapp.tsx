import {
    Args,
    Client,
    ClientFactory,
    DefaultProviderUrls,
    IAccount,
    MassaCoin,
} from '@massalabs/massa-web3';
import { useEffect, useState } from 'react';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const MAX_LOOP = 50;

const baseAccount = {
    address: "",
    secretKey: "",
    publicKey: "",
} as IAccount;

const sc_addr: string = 'AS12nHeu7p24Mb1CitmmYEFomXavn7RCHWb6vwd4U5nVAT8V3LLCf';

export default function Counter() {
    const [valueInput, setValueInput] = useState<string>('');
    const [client, setClient] = useState<Client | null>(null);
    const [triggerResult, setTriggerResult] = useState<string | null>(null);

    // initialize a testnet client
    useEffect(() => {
        const connectClient = async () => {
            const newClient = await ClientFactory.createDefaultClient(
                DefaultProviderUrls.TESTNET,
                false,
                baseAccount
            );
            setClient(newClient);
        };
        connectClient().catch((err) => console.error(err));
    }, []);

    async function fetchEvent(operationId: string): Promise<string> {
        let tick = 0;
        let event;
        while (tick < MAX_LOOP) {
            try {
                event = await client?.smartContracts().getFilteredScOutputEvents({
                    emitter_address: null,
                    start: null,
                    end: null,
                    original_caller_address: null,
                    original_operation_id: operationId,
                    is_final: null,
                });
            } catch (error) {
                console.error(error);
                continue;
            }
            if (event != undefined && event[0]) {
                console.log("event caught:", event);
                return event[0].data;
            }
            tick++;
            await delay(5000);
        }
        return `No event emitted by ${operationId}`;
    }

    async function handleIncrClick(value: number) {
        const args = new Args().addU32(value);
        if (client) {
            console.log(`Incrementing value by ${value}`);
            const res = await client.smartContracts().callSmartContract({
                fee: 2,
                maxGas: 1_000_000_000,
                coins: new MassaCoin('1'),
                targetAddress: sc_addr,
                functionName: 'increment',
                parameter: args.serialize(),
            });
            console.log(`Operation id: ${res}`);
        }
    }

    async function triggerValue() {
        if (client) {
            const res = await client.smartContracts().callSmartContract({
                fee: 2,
                maxGas: 1_000_000_000,
                coins: new MassaCoin('1'),
                targetAddress: sc_addr,
                functionName: 'triggerValue',
                parameter: new Args().serialize(),
            });
            console.log(`triggerValue requested, Operation id: ${res}`);
            setTriggerResult(await fetchEvent(res));
        }
    }

    return (
        <div id="box-wrapper">
            <div className="box">
            <input type="text" value={valueInput} onChange={(e) => setValueInput(e.target.value)} placeholder='Type u32 as increment' />
            <button onClick={async () => {
                if (valueInput === '' || !client){
                    alert("Please enter a correct value");
                    return;
                }
                await handleIncrClick(parseInt(valueInput))}}>Increment</button>
            {client ? (
                <button
                    onClick={async () => {
                        await triggerValue();
                    }}
                >
                    TriggerValue
                </button>
            ) : (
                <div>Client not connected</div>
            )}

            </div>

            <div id="right-box" className="box">
            Counter Value: {triggerResult ? triggerResult: "?"}
            </div>
        </div>
    );
}

