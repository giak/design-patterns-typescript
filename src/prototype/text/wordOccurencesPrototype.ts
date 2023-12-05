import { performance } from 'perf_hooks';

const loremIpsum =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut mauris eget quam maximus varius congue a arcu. In malesuada molestie tellus, ut scelerisque urna accumsan at. Morbi aliquet nulla ligula, ac efficitur magna viverra in. Mauris varius, nibh vitae convallis viverra, ex felis dignissim urna, id efficitur leo risus in quam. Morbi id vehicula odio. Donec condimentum id lectus ut accumsan. Nulla congue libero vel mi convallis, in bibendum mauris porta. In dignissim suscipit suscipit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ut ligula vel est hendrerit faucibus eget eget ligula. In hac habitasse platea dictumst. Ut suscipit orci ac elit suscipit, porta varius sem vulputate. Etiam porttitor efficitur urna ac dapibus. Nunc at turpis semper, vehicula leo eu, aliquet metus. Maecenas leo elit, scelerisque at aliquet at, gravida sit amet justo. Aliquam erat volutpat. Nunc aliquam molestie efficitur. Quisque lorem leo, mattis et ante eu, viverra condimentum diam. Phasellus ultricies sed diam eget porta. Ut fermentum, dui non pulvinar imperdiet, sem lectus lobortis massa, sed maximus nisl mi et eros. Maecenas in blandit velit, ac laoreet eros. Aenean ut ligula nec diam rutrum pellentesque. Curabitur nisl nunc, luctus sed ullamcorper ac, hendrerit non odio. In ut varius nisi. In hac habitasse platea dictumst. Nunc odio ligula, dapibus at rutrum nec, aliquet a ante. Nunc in urna est. Proin eu quam massa. Cras vitae erat sit amet felis convallis iaculis. Vestibulum eget auctor velit, non aliquet magna. Nulla sed posuere dolor. Sed vel neque iaculis tortor elementum euismod a eget leo. Mauris feugiat ligula sed ligula accumsan pretium. Nunc vitae felis odio. Quisque tempor rutrum lectus, quis bibendum ipsum laoreet non. Curabitur sed felis vel dui pellentesque cursus. Suspendisse commodo ut felis a suscipit. Nulla non ipsum felis. Cras elementum lacus metus, at dictum arcu rhoncus eu. Mauris eu orci cursus, sagittis sapien nec, elementum diam. Mauris consequat mi elit, in faucibus nisl lobortis porta. Pellentesque dignissim volutpat diam quis mollis. Aliquam ac mauris sed ipsum interdum molestie sit amet at lorem. Sed quis rhoncus turpis, at accumsan odio.';

class WordOccurences {
  occurrences: Array<number>;

  constructor(private text: string, private find: string) {
    this.occurrences = [];
    const regex = new RegExp(`\\b${find}\\b`, 'g');
    let match;
    while ((match = regex.exec(text)) !== null) {
      this.occurrences.push(match.index);
    }
  }

  getOccurrences() {
    return this.occurrences;
  }

  clone() {
    const clone = new WordOccurences(this.text, this.find);
    clone.occurrences = [...this.occurrences];
    return clone;
  }
}

const main = () => {
  const start = performance.now();
  const wordOccurrences1 = new WordOccurences(loremIpsum, 'mauris');
  console.log(wordOccurrences1.getOccurrences());
  const runningOnce = performance.now();
  const wordOccurrences2 = wordOccurrences1.clone();
  console.log(wordOccurrences2.getOccurrences());
  const runningTwice = performance.now();
  const wordOccurrences3 = wordOccurrences2.clone();
  console.log(wordOccurrences3.getOccurrences());
  const end = performance.now();
  console.log(`First execution : running time: ${runningOnce - start}`);
  console.log(`Second execution : running time: ${runningTwice - runningOnce}`);
  console.log(`Third execution : running time: ${end - runningTwice}`);
  console.log(`From start : running time: ${end - start}`);
};

main();
