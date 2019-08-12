import {Injectable} from '@angular/core'
import {HashLocationStrategy} from '@angular/common'

@Injectable()
export class CustomHashLocationStrategy extends HashLocationStrategy {

  prepareExternalUrl(internal: string): string {
    return this.getBaseHref() + 'eb' + internal
  }
}