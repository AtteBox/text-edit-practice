import { ILevelResult } from "../utilities/game";
import { getDangerColor } from "../utils";

function LevelResultsBar({ levelResults }: { levelResults: ILevelResult }) {
  const level = levelResults.currentLevel;
  return (
    <div className="flex gap-4">
      <p
        className="text-sm"
        style={{
          color: getDangerColor(
            (levelResults.germs ?? 0) / levelResults.levelTotalGerms,
          ),
        }}
      >
        Germs: {levelResults.germs}/{levelResults.levelTotalGerms}
      </p>
      <p className="text-sm">+</p>
      <p
        className="text-sm"
        style={{
          color: getDangerColor(
            1 - (levelResults.animals ?? 0) / levelResults.levelTotalAnimals,
          ),
        }}
      >
        Animals: {levelResults.animals}/{levelResults.levelTotalAnimals}
      </p>
      <p className="text-sm">+</p>
      <p
        className="text-sm"
        style={{
          color: getDangerColor(
            levelResults.elapsedTime / 1000 / level.targetTimeSeconds,
          ),
        }}
      >
        Time: {Math.floor(levelResults.elapsedTime / 1000)}/
        {level.targetTimeSeconds}s
      </p>
      <p className="text-sm">*</p>{" "}
      <p
        className="text-sm"
        style={{
          color: getDangerColor((level.pointCoefficient - 100) / 150),
        }}
      >
        Difficulty: {level.pointCoefficient}
      </p>
      <p className="text-sm">=</p>
      <p
        className="text-sm"
        style={{
          color: getDangerColor(
            Math.max(200 - levelResults.currentLevelPoints, 0) / 200,
          ),
        }}
      >
        Points: {levelResults.currentLevelPoints}
      </p>
    </div>
  );
}

export default LevelResultsBar;
