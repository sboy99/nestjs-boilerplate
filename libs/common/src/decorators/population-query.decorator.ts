import type { AbstractEntity } from '@app/infra';
import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import type { FindOptionsRelations } from 'typeorm';

import type { TPopulationQuery } from '../types';

type TPopulation<T extends AbstractEntity<T>> = {
  populatableFields: Array<keyof T> | string[];
  defaultPopulate?: Array<keyof T> | string[];
};

export const PopulationQuery = createParamDecorator(
  <T extends AbstractEntity<T>>(population: TPopulation<T>, ctx: ExecutionContext): TPopulationQuery<T> | undefined => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const populatableFields = population.populatableFields;
    const defaultPopulate = population?.defaultPopulate && population.defaultPopulate.join(',');
    const populateString: string | undefined = req.query?.populate ? (req.query.populate as string) : defaultPopulate;

    if (!populateString) return;

    // check if the valid params sent is an array
    if (!Array.isArray(populatableFields)) throw new BadRequestException('Invalid populate parameter');

    // validate the format of the populate, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
    if (!populateString.match(/^[a-zA-Z0-9_,.]+$/)) {
      throw new BadRequestException('Invalid populate parameter');
    }

    // populate fields array
    const populateedFields = populateString.split(',');

    if (populateString !== defaultPopulate)
      populateedFields.forEach((field) => {
        if (!populatableFields.includes(field as keyof T & string))
          throw new BadRequestException(`Invalid populate property: ${field.toString()}`);
      });

    return populateedFields.reduce<FindOptionsRelations<T>>((acc, field) => {
      const isTopopulate = !field.startsWith('!');

      function assignIspopulateedToAccumulator(path: string): void {
        const keys = path.split('.');
        let currentLevel = acc;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!currentLevel[key]) {
            currentLevel[key] = {};
          }
          currentLevel = currentLevel[key];
        }

        const lastKey = keys[keys.length - 1];
        currentLevel[lastKey] = isTopopulate;
      }

      if (!!isTopopulate) {
        assignIspopulateedToAccumulator(field);
      } else {
        assignIspopulateedToAccumulator(field.substring(1));
      }

      return acc;
    }, {});
  }
);
