import { ShowTeamWeapon } from "./decidedTeamWeapon"
import { WeaponBanPickArea } from "./banPickTable"
import { useState } from "react"
import { WeaponBanpick } from "../weaponBanPick";
import { WeaponInformation } from "../weaponInformation";
import { TeamWeapon } from "../TeamWeapon";

const _initialWeaponInformation = new WeaponInformation();
const weaponInformation = await _initialWeaponInformation.loadWeaponInformation();

export function WeaponArea() {

    const [weaponBanpick, setWeaponBanpick] = useState(new WeaponBanpick(weaponInformation.getNumberOfWeapon()));
    const [ownTeamWeaon, setOwnTeamWeapon] = useState(new TeamWeapon());
    const [opponentTeamWeaon, setOpponentTeamWeapon] = useState(new TeamWeapon());
    const [currentBanpickSwitch, setCurrentBanpickSwitch] = useState(weaponBanpick.ALLY_PICKED);

    // console.log("index to id->", weaponInformation.weaponIndexToId(3));
    // console.log("id to index->", weaponInformation.weaponIdToIndex(10010));

    function selectCancel(index) {
        const weaponId = weaponInformation.weaponIndexToId(index);
        weaponBanpick.cancelTargetWeapons(index, weaponInformation);
        ownTeamWeaon.cancelWeapon(weaponId, weaponInformation);
        opponentTeamWeaon.cancelWeapon(weaponId, weaponInformation);
    }

    const onAllyPick = (index) => {
        const weaponId = weaponInformation.weaponIndexToId(index);
        if (ownTeamWeaon.canAddTeam(weaponId)) {
            selectCancel(index);
            ownTeamWeaon.addWeapon(weaponId);
            weaponBanpick.myTeamPick(index, weaponInformation);
            setWeaponBanpick(weaponBanpick.renew());
            setOwnTeamWeapon(ownTeamWeaon);
        }
    }

    const onOpponentPick = (index) => {
        const weaponId = weaponInformation.weaponIndexToId(index);
        if (opponentTeamWeaon.canAddTeam(weaponId)) {
            selectCancel(index);
            opponentTeamWeaon.decideWeapon(weaponId);
            weaponBanpick.opponentTeamPick(index, weaponInformation);
            setWeaponBanpick(weaponBanpick.renew());
            setOpponentTeamWeapon(opponentTeamWeaon);
        }
    }

    const onBan = (index) => {
        selectCancel(index);
        // const index = weaponInformation.weaponIdToIndex(weaponId);
        weaponBanpick.banTargetWeapons(index, weaponInformation);
        setWeaponBanpick(weaponBanpick.renew())
    }

    const onCancel = (index) => {
        selectCancel(index);
        setWeaponBanpick(weaponBanpick.renew());
        setOwnTeamWeapon(ownTeamWeaon);
        setOpponentTeamWeapon(opponentTeamWeaon);
    }

    const banpickSwitchHandles = {};
    banpickSwitchHandles[weaponBanpick.NOT_SELECTED] = onCancel;
    banpickSwitchHandles[weaponBanpick.ALLY_PICKED] = onAllyPick;
    banpickSwitchHandles[weaponBanpick.OPPONENT_PICKED] = onOpponentPick;
    banpickSwitchHandles[weaponBanpick.BANNED] = onBan;


    const onTableElementClick = (index) => {
        console.log(banpickSwitchHandles);
        console.log(currentBanpickSwitch);
        banpickSwitchHandles[currentBanpickSwitch](index);
    }

    const onSwitchButtonClick = (newSwitch) => {
        setCurrentBanpickSwitch(newSwitch);
    }

    const onClickResetButton = () => {
        setWeaponBanpick(weaponBanpick.reset());
        setOwnTeamWeapon(new TeamWeapon());
        setOpponentTeamWeapon(new TeamWeapon());
    }

    return (
        <div className="weapon-area">
            <p>
                <div className="team-weapon-title">
                    <div className="title-ally-switch">⚫︎</div>
                </div>
                <div className="team-weapon-title">自チームpick状況</div>
            </p>
            <ShowTeamWeapon teamWeapon={ownTeamWeaon}/>
            <p>
                <div className="team-weapon-title">
                    <div className="title-opponent-switch">⚫︎</div>
                </div>
                <div className="team-weapon-title">敵チームpick状況</div>
            </p>
            <ShowTeamWeapon teamWeapon={opponentTeamWeaon}/>
            <WeaponBanPickArea
                weaponBanPick={weaponBanpick}
                ontTableElementClick={onTableElementClick}
                currentBanpickSwitch={currentBanpickSwitch}
                onSwitchButtonClick={onSwitchButtonClick}
                weaponInformation={weaponInformation}
            />
            <button 
                className="weapon-reset-button"
                onClick={onClickResetButton}
            >
            リセット
            </button>
        </div>
    )
}