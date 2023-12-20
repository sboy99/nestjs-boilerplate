import type { AbstractDocument } from '@app/infra/database';
import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import type { ProjectionType } from 'mongoose';

import type { TSelectionQuery } from '../types';

type TSelection<T extends AbstractDocument<T>> = {
  selectableFields: Array<keyof T> | string[];
  defaultSelected: Array<keyof T> | string[];
};

export const SelectionQuery = createParamDecorator(
  <T extends AbstractDocument<T>>(selection: TSelection<T>, ctx: ExecutionContext): TSelectionQuery<T> => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const selectableFields = selection.selectableFields;
    const defaultSelect = selection.defaultSelected.join(',');
    const selectString: string = req.query?.select ? (req.query.select as string) : defaultSelect;

    // check if the valid params sent is an array
    if (!Array.isArray(selectableFields)) throw new BadRequestException('Invalid select parameter');

    // validate the format of the select, if the rule is 'isnull' or 'isnotnull' it don't need to have a value
    // enable for not selecting if (!selectString.match(/^[a-zA-Z0-9_!,.]+$/)) {
    if (!selectString.match(/^[a-zA-Z0-9_,.]+$/)) {
      throw new BadRequestException('Invalid select parameter');
    }

    // select fields array
    const selectedFields = selectString.split(',');

    // clean slectable fields by removing '!'
    // const cleanedSeletedFields = selectedFields.map((field) => (!field.startsWith('!') ? field : field.substring(1)));

    if (selectString !== defaultSelect)
      selectedFields.forEach((field) => {
        if (!selectableFields.includes(field as keyof T & string))
          throw new BadRequestException(`Invalid select property: ${field.toString()}`);
      });

    return selectedFields.reduce<ProjectionType<T>>((acc, field) => {
      const isToSelect = !field.startsWith('!');

      function assignIsSelectedToAccumulator(path: string): void {
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
        currentLevel[lastKey] = isToSelect;
      }

      if (!!isToSelect) {
        assignIsSelectedToAccumulator(field);
      } else {
        assignIsSelectedToAccumulator(field.substring(1));
      }

      return acc;
    }, {});
  }
);
