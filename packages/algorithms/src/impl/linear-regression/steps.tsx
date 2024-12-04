import type { Coords3D } from "../../lib";
import type { LinearRegressionDefinition } from "./types";
import Text from "../../lib/descriptions/text";
import Paragraph from "../../lib/descriptions/paragraph";
import List, { ListItem } from "../../lib/descriptions/list";
import Note from "../../lib/descriptions/note";
import Expression from "../../lib/descriptions/math";

export const getLinearRegressionSteps: LinearRegressionDefinition["getSteps"] =
  async (config, initialStep) => {
    const steps = [initialStep];
    const { points } = config;

    // calculate means
    const means = {
      x: points.reduce((sum, point) => sum + point.coords.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.coords.y, 0) / points.length,
      z: points.reduce((sum, point) => sum + point.coords.z, 0) / points.length,
    };

    steps.push({
      type: "calculateMeans",
      title: "Calculate Means",
      state: { means },
      description: (
        <Text>
          <Paragraph>
            In this model, we treat <Expression>x</Expression> as our
            independent variable (predictor), while <Expression>y</Expression>{" "}
            and <Expression>z</Expression> are our dependent variables
            (outcomes).
          </Paragraph>
          <Paragraph>
            First, we calculate the center point of our data by finding the
            average (mean) of all <Expression>x</Expression>,{" "}
            <Expression>y</Expression>, and <Expression>z</Expression>{" "}
            coordinates:
          </Paragraph>
        </Text>
      ),
    });

    // calculate coefficients (slope and intercept)
    const numeratorXY = points.reduce(
      (sum, point) =>
        sum + (point.coords.x - means.x) * (point.coords.y - means.y),
      0,
    );

    const numeratorXZ = points.reduce(
      (sum, point) =>
        sum + (point.coords.x - means.x) * (point.coords.z - means.z),
      0,
    );

    const denominatorX = points.reduce(
      (sum, point) => sum + Math.pow(point.coords.x - means.x, 2),
      0,
    );

    const coefficients = {
      slopeXY: numeratorXY / denominatorX,
      slopeXZ: numeratorXZ / denominatorX,
      interceptY: means.y - (numeratorXY / denominatorX) * means.x,
      interceptZ: means.z - (numeratorXZ / denominatorX) * means.x,
    };

    steps.push({
      type: "calculateCoefficients",
      title: "Calculate Coefficients",
      state: { means, coefficients },
      description: (
        <Text>
          <Paragraph>
            We're performing two separate simple linear regressions: one for{" "}
            <Expression>x \rightarrow y</Expression> and another for{" "}
            <Expression>x \rightarrow z</Expression>. For each regression, we
            calculate:
          </Paragraph>
          <List>
            <ListItem>
              A slope that tells us how much the dependent variable (
              <Expression>y</Expression> or <Expression>z</Expression>) changes
              when <Expression>x</Expression> increases
            </ListItem>
            <ListItem>
              An intercept that tells us the baseline value when{" "}
              <Expression>x</Expression> is zero
            </ListItem>
          </List>
          <Note>
            Note: This approach treats <Expression>y</Expression> and{" "}
            <Expression>z</Expression> as independent from each other. Each
            prediction depends only on <Expression>x</Expression>, not on the
            other dependent variable.
          </Note>
        </Text>
      ),
    });

    // create prediction line points
    const minX = Math.min(...points.map((p) => p.coords.x));
    const maxX = Math.max(...points.map((p) => p.coords.x));

    const predictionLine = {
      start: {
        x: minX,
        y: coefficients.slopeXY * minX + coefficients.interceptY,
        z: coefficients.slopeXZ * minX + coefficients.interceptZ,
      } as Coords3D,
      end: {
        x: maxX,
        y: coefficients.slopeXY * maxX + coefficients.interceptY,
        z: coefficients.slopeXZ * maxX + coefficients.interceptZ,
      } as Coords3D,
    };

    steps.push({
      type: "updateLine",
      title: "Create Regression Line",
      state: { means, coefficients, predictionLine },
      description: (
        <Text>
          <Paragraph>
            Using our coefficients, we create a line in 3D space that represents
            our predictions. This line:
          </Paragraph>
          <List>
            <ListItem>
              Uses <Expression>x</Expression> values as inputs to predict both{" "}
              <Expression>y</Expression> and <Expression>z</Expression> values
            </ListItem>
            <ListItem>
              Spans from the minimum to maximum <Expression>x</Expression>{" "}
              values in our dataset
            </ListItem>
            <ListItem>
              Shows how both dependent variables (<Expression>y</Expression> and{" "}
              <Expression>z</Expression>) change with <Expression>x</Expression>
            </ListItem>
          </List>
        </Text>
      ),
    });

    const sumOfSquaredErrors = points.reduce((sum, point) => {
      const predictedY =
        coefficients.slopeXY * point.coords.x + coefficients.interceptY;
      const predictedZ =
        coefficients.slopeXZ * point.coords.x + coefficients.interceptZ;
      return (
        sum +
        Math.pow(point.coords.y - predictedY, 2) +
        Math.pow(point.coords.z - predictedZ, 2)
      );
    }, 0);

    steps.push({
      type: "calculateSumOfSquaredErrors",
      title: "Evaluate Model Accuracy",
      state: { sumOfSquaredErrors, coefficients, means, predictionLine },
      description: (
        <Text>
          <Paragraph>
            Finally, we evaluate how well our model fits the data by calculating
            the sum of squared errors for both predictions (
            <Expression>y</Expression> and <Expression>z</Expression>):
          </Paragraph>
          <List>
            <ListItem>
              For each point, we calculate the difference between actual and
              predicted values
            </ListItem>
            <ListItem>
              We combine the errors from both <Expression>y</Expression> and{" "}
              <Expression>z</Expression> predictions
            </ListItem>
            <ListItem>
              The total error gives us a measure of how well our model predicts
              both dependent variables
            </ListItem>
          </List>
          <Note>
            Remember: Since we treated <Expression>y</Expression> and{" "}
            <Expression>z</Expression> independently, their errors are
            calculated separately and then combined.
          </Note>
        </Text>
      ),
    });

    return steps;
  };
